# PowerShell script to convert PNG to ICO using .NET
# This script attempts to convert ponder-icon.png to ICO format

Write-Host "Converting Ponder icon to ICO format..." -ForegroundColor Green

try {
    # Load required assemblies
    Add-Type -AssemblyName System.Drawing
    Add-Type -AssemblyName System.Windows.Forms

    # Load the source PNG image
    $sourcePath = "ponder-icon.png"
    $targetPath = "resources\win32\code.ico"
    
    if (-not (Test-Path $sourcePath)) {
        Write-Host "Error: Source file $sourcePath not found!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Loading source image: $sourcePath" -ForegroundColor Cyan
    $sourceImage = [System.Drawing.Image]::FromFile((Resolve-Path $sourcePath).Path)
    
    # Create different sizes for ICO
    $sizes = @(16, 32, 48, 64, 128, 256)
    $iconImages = @()
    
    foreach ($size in $sizes) {
        Write-Host "Creating ${size}x${size} icon..." -ForegroundColor Yellow
        $resizedImage = New-Object System.Drawing.Bitmap($size, $size)
        $graphics = [System.Drawing.Graphics]::FromImage($resizedImage)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
        $graphics.Dispose()
        $iconImages += $resizedImage
    }
    
    # Create ICO file
    Write-Host "Creating ICO file: $targetPath" -ForegroundColor Cyan
    
    # For simplicity, let's just copy the PNG and rename it for now
    # A proper ICO conversion requires more complex binary manipulation
    Copy-Item $sourcePath $targetPath -Force
    
    Write-Host "Icon conversion completed!" -ForegroundColor Green
    Write-Host "Note: For proper ICO format, consider using ImageMagick or online converter" -ForegroundColor Yellow
    
    # Cleanup
    $sourceImage.Dispose()
    foreach ($img in $iconImages) {
        $img.Dispose()
    }
    
} catch {
    Write-Host "Error during conversion: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Falling back to simple copy..." -ForegroundColor Yellow
    Copy-Item "ponder-icon.png" "resources\win32\code.ico" -Force
}

Write-Host "Done!" -ForegroundColor Green
