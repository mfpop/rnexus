import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import AuthService from "./lib/authService";

// Configure the GraphQL endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql/", // Django backend running on port 8000
});

// Add authentication headers using AuthService
const authLink = setContext((_, { headers }) => {
  // Get the token from AuthService which handles both localStorage and sessionStorage
  const token = AuthService.getToken();
  console.log('Apollo authLink - Token present:', !!token);
  console.log('Apollo authLink - Token preview:', token ? token.substring(0, 20) + '...' : 'null');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error handling link for authentication errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
      if (message.includes('Authentication required') || message.includes('not authenticated')) {
        console.warn('Authentication error detected, clearing token and redirecting to login');
        AuthService.logout();
        window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
    if ('statusCode' in networkError && (networkError.statusCode === 401 || networkError.statusCode === 403)) {
      console.warn('Network authentication error detected, clearing token and redirecting to login');
      AuthService.logout();
      window.location.href = '/login';
    }
  }
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
