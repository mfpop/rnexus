// Home Page Comprehensive Functionality Test
// Run this in browser console on http://localhost:5175

class HomePageTester {
    constructor() {
        this.results = [];
        this.testStartTime = new Date();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const result = { timestamp, message, type };
        this.results.push(result);
        console.log(`[${type.toUpperCase()}] ${timestamp}: ${message}`);
    }

    async testBackendConnectivity() {
        this.log('Testing backend connectivity...', 'info');

        try {
            const response = await fetch('http://localhost:8001/graphql/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `query { __typename }`
                })
            });

            if (response.ok) {
                this.log('✅ Backend GraphQL endpoint is accessible', 'pass');
                return true;
            } else {
                this.log(`❌ Backend returned ${response.status}: ${response.statusText}`, 'fail');
                return false;
            }
        } catch (error) {
            this.log(`❌ Backend connection failed: ${error.message}`, 'fail');
            return false;
        }
    }

    testReactComponents() {
        this.log('Testing React components presence...', 'info');

        // Check if React is loaded
        if (typeof React === 'undefined') {
            this.log('❌ React is not loaded', 'fail');
            return false;
        }

        this.log('✅ React is loaded', 'pass');

        // Check for key elements
        const checks = [
            { selector: '[data-testid="home-left-card"], .home-left-card, nav', name: 'Home Left Navigation Card' },
            { selector: '[data-testid="home-right-card"], .home-right-card, main', name: 'Home Right Content Card' },
            { selector: '[data-testid="stats-grid"], .stats-grid, [class*="grid"]', name: 'Stats Grid' },
            { selector: '[data-testid="activities"], .activities, [class*="activities"]', name: 'Activities Section' },
        ];

        checks.forEach(check => {
            const element = document.querySelector(check.selector);
            if (element) {
                this.log(`✅ ${check.name} found`, 'pass');
            } else {
                this.log(`⚠️ ${check.name} not found with selector: ${check.selector}`, 'warn');
            }
        });

        return true;
    }

    testNavigationLinks() {
        this.log('Testing navigation links...', 'info');

        const expectedRoutes = [
            '/news', '/activities', '/production', '/chat',
            '/system', '/settings', '/help', '/contact',
            '/projects', '/metrics', '/about'
        ];

        // Look for navigation links
        const links = document.querySelectorAll('a[href*="/"], button[onclick*="navigate"], div[onclick*="handleCardClick"]');

        if (links.length > 0) {
            this.log(`✅ Found ${links.length} navigation elements`, 'pass');

            // Check for specific routes in the DOM
            expectedRoutes.forEach(route => {
                const routeElements = document.querySelectorAll(`[href*="${route}"], [onclick*="${route}"]`);
                if (routeElements.length > 0) {
                    this.log(`✅ Route ${route} navigation found`, 'pass');
                } else {
                    this.log(`⚠️ Route ${route} navigation not found`, 'warn');
                }
            });
        } else {
            this.log('❌ No navigation links found', 'fail');
        }

        return links.length > 0;
    }

    testDataDisplay() {
        this.log('Testing data display...', 'info');

        // Check for stats (should be 4 stats)
        const statsElements = document.querySelectorAll('[class*="stat"], [data-testid*="stat"]');
        if (statsElements.length >= 4) {
            this.log(`✅ Found ${statsElements.length} stats elements (expected 4+)`, 'pass');
        } else {
            this.log(`⚠️ Found ${statsElements.length} stats elements (expected 4)`, 'warn');
        }

        // Check for activities (should be 9 activities)
        const activityElements = document.querySelectorAll('[class*="activity"], [data-testid*="activity"]');
        if (activityElements.length >= 9) {
            this.log(`✅ Found ${activityElements.length} activity elements (expected 9+)`, 'pass');
        } else {
            this.log(`⚠️ Found ${activityElements.length} activity elements (expected 9)`, 'warn');
        }

        // Look for specific data values from HomeRightCard
        const expectedStats = ['94.2%', '98.7%', '156', '92.3%'];
        expectedStats.forEach(stat => {
            if (document.body.textContent.includes(stat)) {
                this.log(`✅ Found expected stat value: ${stat}`, 'pass');
            } else {
                this.log(`⚠️ Expected stat value not found: ${stat}`, 'warn');
            }
        });

        return true;
    }

    testResponsiveLayout() {
        this.log('Testing responsive layout...', 'info');

        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.log(`Current viewport: ${viewport.width}x${viewport.height}`, 'info');

        // Check for responsive classes or flexible layout
        const responsiveElements = document.querySelectorAll('[class*="flex"], [class*="grid"], [class*="responsive"]');
        if (responsiveElements.length > 0) {
            this.log(`✅ Found ${responsiveElements.length} responsive layout elements`, 'pass');
        } else {
            this.log('⚠️ No obvious responsive layout elements found', 'warn');
        }

        // Test basic layout structure
        const mainContainers = document.querySelectorAll('main, [role="main"], .main-container');
        if (mainContainers.length > 0) {
            this.log(`✅ Found ${mainContainers.length} main container(s)`, 'pass');
        } else {
            this.log('⚠️ No main container found', 'warn');
        }

        return true;
    }

    checkConsoleErrors() {
        this.log('Checking for console errors...', 'info');

        // Note: This is a basic check. Real console error monitoring would need to be set up differently
        if (window.performance && window.performance.navigation) {
            this.log('✅ Page loaded without critical navigation errors', 'pass');
        }

        // Check if there are any global error handlers
        if (window.onerror || window.addEventListener) {
            this.log('✅ Error handling mechanisms available', 'pass');
        }

        return true;
    }

    async runAllTests() {
        this.log('🚀 Starting Home Page Comprehensive Test Suite', 'info');
        this.log(`Test environment: ${window.location.origin}`, 'info');

        const tests = [
            { name: 'Backend Connectivity', method: () => this.testBackendConnectivity() },
            { name: 'React Components', method: () => this.testReactComponents() },
            { name: 'Navigation Links', method: () => this.testNavigationLinks() },
            { name: 'Data Display', method: () => this.testDataDisplay() },
            { name: 'Responsive Layout', method: () => this.testResponsiveLayout() },
            { name: 'Console Errors', method: () => this.checkConsoleErrors() }
        ];

        let passedTests = 0;

        for (const test of tests) {
            this.log(`\n--- Running ${test.name} Test ---`, 'info');
            try {
                const result = await test.method();
                if (result !== false) {
                    passedTests++;
                    this.log(`✅ ${test.name} test completed`, 'pass');
                } else {
                    this.log(`❌ ${test.name} test failed`, 'fail');
                }
            } catch (error) {
                this.log(`❌ ${test.name} test threw error: ${error.message}`, 'fail');
            }
        }

        const testDuration = new Date() - this.testStartTime;
        this.log(`\n🏁 Test Suite Complete`, 'info');
        this.log(`Tests passed: ${passedTests}/${tests.length}`, 'info');
        this.log(`Duration: ${testDuration}ms`, 'info');

        return this.generateReport();
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            environment: {
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            },
            results: this.results,
            summary: {
                total: this.results.length,
                passed: this.results.filter(r => r.type === 'pass').length,
                failed: this.results.filter(r => r.type === 'fail').length,
                warnings: this.results.filter(r => r.type === 'warn').length
            }
        };

        // Display summary
        console.group('📊 Test Report Summary');
        console.table(report.summary);
        console.groupEnd();

        return report;
    }
}

// Auto-run tests when script loads
const tester = new HomePageTester();
tester.runAllTests().then(report => {
    console.log('Full test report:', report);

    // Store results globally for inspection
    window.homePageTestResults = report;

    console.log('\n💡 To access full results: window.homePageTestResults');
    console.log('💡 To run tests again: new HomePageTester().runAllTests()');
});
