/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

# Ponder IDE icon copy script (PowerShell)
# This script copies ponder-icon.png to all required locations

Write-Host "Starting to copy Ponder IDE icon files..." -ForegroundColor Green

# Check if source icon file exists
if (-not (Test-Path "ponder-icon.png")) {
    Write-Host "Error: ponder-icon.png file not found" -ForegroundColor Red
    exit 1
}

# Create necessary directories
$directories = @(
    "resources\win32",
    "resources\darwin",
    "resources\linux",
    "resources\server",
    "extensions\ponder-authentication\media"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir" -ForegroundColor Yellow
    }
}

# Copy to Linux directory (use PNG directly)
Copy-Item "ponder-icon.png" "resources\linux\code.png" -Force
Write-Host "Copied to Linux: resources\linux\code.png" -ForegroundColor Cyan

# Copy to authentication extension directory
Copy-Item "ponder-icon.png" "extensions\ponder-authentication\media\icon.png" -Force
Write-Host "Copied to authentication extension: extensions\ponder-authentication\media\icon.png" -ForegroundColor Cyan

# For Windows and macOS, we need image processing tools
# Here we copy PNG files directly first, users need to manually convert formats

# Windows icons (need to convert to ICO format)
Copy-Item "ponder-icon.png" "resources\win32\code.ico.png" -Force
Copy-Item "ponder-icon.png" "resources\win32\ponder_150x150.png" -Force
Copy-Item "ponder-icon.png" "resources\win32\ponder_70x70.png" -Force
Write-Host "Copied to Windows directory (need to manually convert to ICO format)" -ForegroundColor Yellow

# macOS icons (need to convert to ICNS format)
Copy-Item "ponder-icon.png" "resources\darwin\code.icns.png" -Force
Write-Host "Copied to macOS directory (need to manually convert to ICNS format)" -ForegroundColor Yellow

# Web/Server icons
Copy-Item "ponder-icon.png" "resources\server\ponder-192.png" -Force
Copy-Item "ponder-icon.png" "resources\server\ponder-512.png" -Force
Copy-Item "ponder-icon.png" "resources\server\favicon.ico.png" -Force
Write-Host "Copied to server directory (need to resize)" -ForegroundColor Cyan

Write-Host "`nIcon file copying completed!" -ForegroundColor Green
Write-Host "`nNotes:" -ForegroundColor Yellow
Write-Host "1. Windows icons need to be converted to ICO format" -ForegroundColor White
Write-Host "2. macOS icons need to be converted to ICNS format" -ForegroundColor White
Write-Host "3. Web icons need to be resized to correct dimensions (192x192, 512x512)" -ForegroundColor White
Write-Host "4. Windows tile icons need to be resized to 150x150 and 70x70 pixels" -ForegroundColor White
Write-Host "`nRecommend using ImageMagick or online tools for format conversion" -ForegroundColor Cyan
