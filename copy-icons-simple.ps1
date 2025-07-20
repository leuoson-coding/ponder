# Simple Ponder IDE icon copy script
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

# Copy to Linux directory (direct PNG usage)
Copy-Item "ponder-icon.png" "resources\linux\code.png" -Force
Write-Host "Copied to Linux: resources\linux\code.png" -ForegroundColor Cyan

# Copy to authentication extension directory
Copy-Item "ponder-icon.png" "extensions\ponder-authentication\media\icon.png" -Force
Write-Host "Copied to auth extension: extensions\ponder-authentication\media\icon.png" -ForegroundColor Cyan

# Windows icons (need conversion to ICO format)
Copy-Item "ponder-icon.png" "resources\win32\code.ico.png" -Force
Copy-Item "ponder-icon.png" "resources\win32\ponder_150x150.png" -Force
Copy-Item "ponder-icon.png" "resources\win32\ponder_70x70.png" -Force
Write-Host "Copied to Windows directory (manual ICO conversion needed)" -ForegroundColor Yellow

# macOS icons (need conversion to ICNS format)
Copy-Item "ponder-icon.png" "resources\darwin\code.icns.png" -Force
Write-Host "Copied to macOS directory (manual ICNS conversion needed)" -ForegroundColor Yellow

# Web/server icons
Copy-Item "ponder-icon.png" "resources\server\ponder-192.png" -Force
Copy-Item "ponder-icon.png" "resources\server\ponder-512.png" -Force
Copy-Item "ponder-icon.png" "resources\server\favicon.ico.png" -Force
Write-Host "Copied to server directory (size adjustment needed)" -ForegroundColor Cyan

Write-Host "`nIcon file copying completed!" -ForegroundColor Green
Write-Host "`nNotes:" -ForegroundColor Yellow
Write-Host "1. Windows icons need conversion to ICO format" -ForegroundColor White
Write-Host "2. macOS icons need conversion to ICNS format" -ForegroundColor White
Write-Host "3. Web icons need resizing to correct dimensions (192x192, 512x512)" -ForegroundColor White
Write-Host "4. Windows tile icons need resizing to 150x150 and 70x70 pixels" -ForegroundColor White
Write-Host "`nRecommend using ImageMagick or online tools for format conversion" -ForegroundColor Cyan
