/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

# Ponder IDE startup script (PowerShell)

Write-Host "Starting Ponder IDE..." -ForegroundColor Green

# Set environment variables
$env:NODE_ENV = "development"
$env:VSCODE_DEV = "1"
$env:VSCODE_CLI = "1"
$env:ELECTRON_ENABLE_LOGGING = "1"
$env:ELECTRON_ENABLE_STACK_DUMPING = "1"

# Skip prelaunch check (avoid extension download failures)
$env:VSCODE_SKIP_PRELAUNCH = "1"

# Check if Electron executable exists
$electronPath = ".build\electron\Code - OSS.exe"
if (-not (Test-Path "$electronPath")) {
    Write-Host "Error: Electron executable not found: $electronPath" -ForegroundColor Red
    Write-Host "Please run 'npm run compile' first to build the project" -ForegroundColor Yellow
    exit 1
}

Write-Host "Startup path: $electronPath" -ForegroundColor Cyan

# Start Ponder IDE
& "$electronPath" . --disable-extension=vscode.vscode-api-tests
Write-Host "Ponder IDE startup command executed" -ForegroundColor Green
