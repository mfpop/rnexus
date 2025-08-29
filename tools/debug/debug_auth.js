// Quick browser console test for authentication
// Run this in the browser console to test authentication state

console.log('=== AUTHENTICATION DEBUG ===');

// Check localStorage/sessionStorage
console.log('localStorage token:', localStorage.getItem('authToken'));
console.log('sessionStorage token:', sessionStorage.getItem('authToken'));

// Check if we can access the AuthService
if (window.AuthService) {
  console.log('AuthService.isAuthenticated():', window.AuthService.isAuthenticated());
  console.log('AuthService.getToken():', window.AuthService.getToken());
} else {
  console.log('AuthService not found on window object');
}

// Test a direct GraphQL query
fetch('http://localhost:8000/graphql/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
  },
  body: JSON.stringify({
    query: `{
      userProfile {
        id
        firstName
        lastName
      }
    }`
  })
})
.then(response => {
  console.log('Direct GraphQL response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Direct GraphQL response data:', data);
})
.catch(error => {
  console.error('Direct GraphQL error:', error);
});
