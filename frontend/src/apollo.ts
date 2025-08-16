import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Configure the GraphQL endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql/", // Django backend running on port 8000
});

// Add authentication headers (if needed)
const authLink = setContext((_, { headers }) => {
  // You might get the token from localStorage or a global state
  const token = localStorage.getItem("token"); // Example: if you use JWT
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
