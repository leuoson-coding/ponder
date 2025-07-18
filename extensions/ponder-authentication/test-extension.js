#!/usr/bin/env node

/**
 * Ponder Authentication Extension 测试脚本
 * 验证扩展的基本功能和配置
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 开始测试 Ponder Authentication Extension...\n');

// 测试 1: 检查必要文件是否存在
console.log('📁 检查文件结构...');
const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'src/extension.ts',
    'src/authProvider.ts',
    'src/logger.ts',
    'src/telemetryReporter.ts',
    'media/icon.png',
    'out/extension.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - 文件不存在`);
        allFilesExist = false;
    }
});

// 测试 2: 检查 package.json 配置
console.log('\n📋 检查 package.json 配置...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // 检查基本信息
    console.log(`  ✅ 扩展名称: ${packageJson.name}`);
    console.log(`  ✅ 版本: ${packageJson.version}`);
    console.log(`  ✅ 显示名称: ${packageJson.displayName}`);
    
    // 检查认证提供者配置
    if (packageJson.contributes && packageJson.contributes.authentication) {
        console.log(`  ✅ 认证提供者已配置`);
        const authProvider = packageJson.contributes.authentication[0];
        console.log(`    - ID: ${authProvider.id}`);
        console.log(`    - 标签: ${authProvider.label}`);
    } else {
        console.log(`  ❌ 认证提供者配置缺失`);
    }
    
    // 检查命令配置
    if (packageJson.contributes && packageJson.contributes.commands) {
        console.log(`  ✅ 命令已配置 (${packageJson.contributes.commands.length} 个)`);
        packageJson.contributes.commands.forEach(cmd => {
            console.log(`    - ${cmd.command}: ${cmd.title}`);
        });
    } else {
        console.log(`  ❌ 命令配置缺失`);
    }
    
    // 检查图标配置
    if (packageJson.icon) {
        console.log(`  ✅ 图标路径: ${packageJson.icon}`);
        if (fs.existsSync(packageJson.icon)) {
            console.log(`    - 图标文件存在`);
        } else {
            console.log(`    - ❌ 图标文件不存在`);
        }
    } else {
        console.log(`  ❌ 图标配置缺失`);
    }
    
} catch (error) {
    console.log(`  ❌ package.json 解析失败: ${error.message}`);
}

// 测试 3: 检查编译输出
console.log('\n🔨 检查编译输出...');
if (fs.existsSync('out/extension.js')) {
    const stats = fs.statSync('out/extension.js');
    console.log(`  ✅ extension.js 已生成 (${Math.round(stats.size / 1024)}KB)`);
} else {
    console.log(`  ❌ extension.js 未生成`);
}

// 测试结果
console.log('\n📊 测试结果:');
if (allFilesExist) {
    console.log('🎉 所有必要文件都存在！');
    console.log('\n🚀 下一步:');
    console.log('  1. 在 VSCode 中打开此项目');
    console.log('  2. 按 F5 启动调试会话');
    console.log('  3. 在新的 VSCode 窗口中测试扩展功能');
    console.log('  4. 使用命令面板搜索 "Ponder" 相关命令');
} else {
    console.log('❌ 部分文件缺失，请检查构建过程');
}

console.log('\n✨ 测试完成！');
