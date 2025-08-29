// Script to clear authentication tokens
// Run this in the browser console

console.log('Clearing authentication tokens...');
localStorage.removeItem('authToken');
sessionStorage.removeItem('authToken');
console.log('Tokens cleared. Please log in again.');

// Redirect to login page
window.location.href = '/login';
