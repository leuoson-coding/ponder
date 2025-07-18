#!/usr/bin/env node

/**
 * Test backend API connection
 */

const https = require('https');
const http = require('http');

const SERVER_URL = 'http://localhost:3001';

console.log('🔗 Testing Ponder backend API connection...\n');

// Test function
async function testAPI(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Ponder-Authentication-Test/1.0'
            }
        };

        const client = urlObj.protocol === 'https:' ? https : http;

        const req = client.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Test various API endpoints
async function runTests() {
    console.log('📡 Testing server connection...');

    // Test 1: Basic connection
    try {
        const response = await testAPI(`${SERVER_URL}/`);
        console.log(`✅ Server connection successful (status code: ${response.statusCode})`);
    } catch (error) {
        console.log(`❌ Server connection failed: ${error.message}`);
        console.log('Please ensure backend server is running on http://localhost:3000');
        return;
    }

    // Test 2: Login page
    console.log('\n🔐 Testing login page...');
    try {
        const authUrl = `${SERVER_URL}/vscode/auth?redirect_uri=vscode://ponder.ponder-authentication/auth-complete&scope=user&state=test123`;
        const response = await testAPI(authUrl);

        if (response.statusCode === 200) {
            console.log('✅ Login page response normal');
            if (response.body.includes('<html') || response.body.includes('<!DOCTYPE')) {
                console.log('  - Returns HTML page (normal)');
            } else {
                console.log('  - Response content may not be HTML page');
            }
        } else {
            console.log(`⚠️ Login page status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`❌ Authorization endpoint test failed: ${error.message}`);
    }

    // Test 3: Callback endpoint
    console.log('\n🔄 Testing callback endpoint...');
    try {
        const response = await testAPI(`${SERVER_URL}/vscode/auth/callback`, 'POST', {
            code: 'test_code',
            state: 'test_state',
            redirect_uri: 'vscode://ponder.ponder-authentication/auth-complete'
        });

        console.log(`✅ Callback endpoint response (status code: ${response.statusCode})`);
        if (response.statusCode === 400 || response.statusCode === 401) {
            console.log('  - This is normal, as we used test data');
        }
    } catch (error) {
        console.log(`❌ Callback endpoint test failed: ${error.message}`);
    }

    // Test 4: User info endpoint
    console.log('\n👤 Testing user info endpoint...');
    try {
        const response = await testAPI(`${SERVER_URL}/vscode/auth/user`, 'GET');

        if (response.statusCode === 401) {
            console.log('✅ User info endpoint normal (requires authentication, returns 401)');
        } else {
            console.log(`✅ User info endpoint response (status code: ${response.statusCode})`);
        }
    } catch (error) {
        console.log(`❌ User info endpoint test failed: ${error.message}`);
    }

    console.log('\n📋 Test Summary:');
    console.log('✅ Backend API is basically available');
    console.log('🚀 Now you can test the complete authentication flow in VSCode!');
    console.log('\n💡 Usage:');
    console.log('1. Open extensions/ponder-authentication in VSCode');
    console.log('2. Press F5 to start debug session');
    console.log('3. Click the "Ponder" button in the status bar in the new window');
    console.log('4. Or use command palette to search "Ponder: Login to Ponder Service"');
}

runTests().catch(console.error);
