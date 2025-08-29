// Test script to clear auth data and test login
// Run in browser console

// Clear all auth data
localStorage.removeItem('authToken');
localStorage.removeItem('authUser');
localStorage.removeItem('authRememberMe');
sessionStorage.removeItem('authToken');
sessionStorage.removeItem('authUser');

console.log('Cleared all auth data');

// Test login function
async function testLogin() {
    try {
        const response = await fetch('http://localhost:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'testuser',
                password: 'testpass123'
            }),
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (data.success) {
            // Store token as AuthService would
            sessionStorage.setItem('authToken', data.token);
            sessionStorage.setItem('authUser', JSON.stringify(data.user));
            console.log('Login successful, token stored');

            // Test GraphQL query
            const gqlResponse = await fetch('http://localhost:8000/graphql/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`,
                },
                body: JSON.stringify({
                    query: `
                        query GetUserProfile {
                            userProfile {
                                first_name
                                last_name
                                bio
                                location
                                website
                                github_username
                                twitter_username
                                linkedin_username
                            }
                        }
                    `
                }),
            });

            const gqlData = await gqlResponse.json();
            console.log('GraphQL response:', gqlData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call test function
testLogin();
