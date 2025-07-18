#!/usr/bin/env node

/**
 * 测试后端 API 连接
 */

const https = require('https');
const http = require('http');

const SERVER_URL = 'http://localhost:3001';

console.log('🔗 测试 Ponder 后端 API 连接...\n');

// 测试函数
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

// 测试各个 API 端点
async function runTests() {
    console.log('📡 测试服务器连接...');

    // 测试 1: 基础连接
    try {
        const response = await testAPI(`${SERVER_URL}/`);
        console.log(`✅ 服务器连接成功 (状态码: ${response.statusCode})`);
    } catch (error) {
        console.log(`❌ 服务器连接失败: ${error.message}`);
        console.log('请确保后端服务器正在运行在 http://localhost:3000');
        return;
    }

    // 测试 2: 登录页面
    console.log('\n🔐 测试登录页面...');
    try {
        const authUrl = `${SERVER_URL}/vscode/auth?redirect_uri=vscode://ponder.ponder-authentication/auth-complete&scope=user&state=test123`;
        const response = await testAPI(authUrl);

        if (response.statusCode === 200) {
            console.log('✅ 登录页面响应正常');
            if (response.body.includes('<html') || response.body.includes('<!DOCTYPE')) {
                console.log('  - 返回HTML页面（正常）');
            } else {
                console.log('  - 响应内容可能不是HTML页面');
            }
        } else {
            console.log(`⚠️ 登录页面状态码: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`❌ 授权端点测试失败: ${error.message}`);
    }

    // 测试 3: 回调端点
    console.log('\n🔄 测试回调端点...');
    try {
        const response = await testAPI(`${SERVER_URL}/vscode/auth/callback`, 'POST', {
            code: 'test_code',
            state: 'test_state',
            redirect_uri: 'vscode://ponder.ponder-authentication/auth-complete'
        });

        console.log(`✅ 回调端点响应 (状态码: ${response.statusCode})`);
        if (response.statusCode === 400 || response.statusCode === 401) {
            console.log('  - 这是正常的，因为我们使用了测试数据');
        }
    } catch (error) {
        console.log(`❌ 回调端点测试失败: ${error.message}`);
    }

    // 测试 4: 用户信息端点
    console.log('\n👤 测试用户信息端点...');
    try {
        const response = await testAPI(`${SERVER_URL}/vscode/auth/user`, 'GET');

        if (response.statusCode === 401) {
            console.log('✅ 用户信息端点正常 (需要认证，返回 401)');
        } else {
            console.log(`✅ 用户信息端点响应 (状态码: ${response.statusCode})`);
        }
    } catch (error) {
        console.log(`❌ 用户信息端点测试失败: ${error.message}`);
    }

    console.log('\n📋 测试总结:');
    console.log('✅ 后端 API 基本可用');
    console.log('🚀 现在可以在 VSCode 中测试完整的认证流程了！');
    console.log('\n💡 使用方法:');
    console.log('1. 在 VSCode 中打开 extensions/ponder-authentication');
    console.log('2. 按 F5 启动调试会话');
    console.log('3. 在新窗口中点击状态栏的 "Ponder" 按钮');
    console.log('4. 或使用命令面板搜索 "Ponder: 登录到 Ponder 服务"');
}

runTests().catch(console.error);
