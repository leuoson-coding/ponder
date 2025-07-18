#!/usr/bin/env node

/**
 * Ponder Authentication Extension 安装脚本
 * 用于快速设置开发环境
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始安装 Ponder Authentication Extension 开发环境...');

// 检查 Node.js 版本
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
    console.error('❌ 需要 Node.js 16 或更高版本，当前版本:', nodeVersion);
    process.exit(1);
}

console.log('✅ Node.js 版本检查通过:', nodeVersion);

// 安装依赖
console.log('📦 安装依赖包...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ 依赖包安装完成');
} catch (error) {
    console.error('❌ 依赖包安装失败:', error.message);
    process.exit(1);
}

// 编译 TypeScript
console.log('🔨 编译 TypeScript 代码...');
try {
    execSync('npm run compile', { stdio: 'inherit' });
    console.log('✅ TypeScript 编译完成');
} catch (error) {
    console.error('❌ TypeScript 编译失败:', error.message);
    process.exit(1);
}

// 运行 lint 检查
console.log('🔍 运行代码检查...');
try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ 代码检查通过');
} catch (error) {
    console.warn('⚠️ 代码检查发现问题，请修复后再继续开发');
}

console.log('\n🎉 Ponder Authentication Extension 开发环境设置完成！');
console.log('\n📖 接下来你可以：');
console.log('   1. 在 VSCode 中打开此项目');
console.log('   2. 按 F5 启动调试会话');
console.log('   3. 在新的 VSCode 窗口中测试扩展功能');
console.log('\n💡 更多信息请查看 README.md 文件');
