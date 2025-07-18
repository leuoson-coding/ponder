#!/usr/bin/env node

/**
 * Ponder Authentication Extension test script
 * Verify basic functionality and configuration of the extension
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Ponder Authentication Extension test...\n');

// Test 1: Check if necessary files exist
console.log('📁 Checking file structure...');
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
        console.log(`  ❌ ${file} - file does not exist`);
        allFilesExist = false;
    }
});

// Test 2: Check package.json configuration
console.log('\n📋 Checking package.json configuration...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // Check basic information
    console.log(`  ✅ Extension name: ${packageJson.name}`);
    console.log(`  ✅ Version: ${packageJson.version}`);
    console.log(`  ✅ Display name: ${packageJson.displayName}`);

    // Check authentication provider configuration
    if (packageJson.contributes && packageJson.contributes.authentication) {
        console.log(`  ✅ Authentication provider configured`);
        const authProvider = packageJson.contributes.authentication[0];
        console.log(`    - ID: ${authProvider.id}`);
        console.log(`    - Label: ${authProvider.label}`);
    } else {
        console.log(`  ❌ Authentication provider configuration missing`);
    }

    // Check command configuration
    if (packageJson.contributes && packageJson.contributes.commands) {
        console.log(`  ✅ Commands configured (${packageJson.contributes.commands.length} commands)`);
        packageJson.contributes.commands.forEach(cmd => {
            console.log(`    - ${cmd.command}: ${cmd.title}`);
        });
    } else {
        console.log(`  ❌ Command configuration missing`);
    }

    // Check icon configuration
    if (packageJson.icon) {
        console.log(`  ✅ Icon path: ${packageJson.icon}`);
        if (fs.existsSync(packageJson.icon)) {
            console.log(`    - Icon file exists`);
        } else {
            console.log(`    - ❌ Icon file does not exist`);
        }
    } else {
        console.log(`  ❌ Icon configuration missing`);
    }

} catch (error) {
    console.log(`  ❌ package.json parsing failed: ${error.message}`);
}

// Test 3: Check compilation output
console.log('\n🔨 Checking compilation output...');
if (fs.existsSync('out/extension.js')) {
    const stats = fs.statSync('out/extension.js');
    console.log(`  ✅ extension.js generated (${Math.round(stats.size / 1024)}KB)`);
} else {
    console.log(`  ❌ extension.js not generated`);
}

// Test results
console.log('\n📊 Test Results:');
if (allFilesExist) {
    console.log('🎉 All necessary files exist!');
    console.log('\n🚀 Next steps:');
    console.log('  1. Open this project in VSCode');
    console.log('  2. Press F5 to start debug session');
    console.log('  3. Test extension functionality in the new VSCode window');
    console.log('  4. Use command palette to search for "Ponder" related commands');
} else {
    console.log('❌ Some files are missing, please check the build process');
}

console.log('\n✨ Test completed!');
