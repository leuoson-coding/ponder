#!/bin/bash
# Ponder IDE icon copy script (Bash)
# This script copies ponder-icon.png to all required locations

echo "Starting to copy Ponder IDE icon files..."

# Check if source icon file exists
if [ ! -f "ponder-icon.png" ]; then
	echo "Error: ponder-icon.png file not found"
	exit 1
fi

# Create necessary directories
directories=(
	"resources/win32"
	"resources/darwin"
	"resources/linux"
	"resources/server"
	"extensions/ponder-authentication/media"
)

for dir in "${directories[@]}"; do
	if [ ! -d "$dir" ]; then
		mkdir -p "$dir"
		echo "Created directory: $dir"
	fi
done

# Copy to Linux directory (use PNG directly)
cp "ponder-icon.png" "resources/linux/code.png"
echo "Copied to Linux: resources/linux/code.png"

# Copy to authentication extension directory
cp "ponder-icon.png" "extensions/ponder-authentication/media/icon.png"
echo "Copied to authentication extension: extensions/ponder-authentication/media/icon.png"

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
	echo "ImageMagick detected, starting icon conversion..."

	# Windows icon conversion
	echo "Converting Windows icons..."
	convert "ponder-icon.png" -resize 256x256 "resources/win32/code.ico"
	convert "ponder-icon.png" -resize 150x150 "resources/win32/ponder_150x150.png"
	convert "ponder-icon.png" -resize 70x70 "resources/win32/ponder_70x70.png"

	# Web/Server icon conversion
	echo "Converting Web icons..."
	convert "ponder-icon.png" -resize 192x192 "resources/server/ponder-192.png"
	convert "ponder-icon.png" -resize 512x512 "resources/server/ponder-512.png"
	convert "ponder-icon.png" -resize 32x32 "resources/server/favicon.ico"

	# macOS icon conversion (requires additional steps)
	echo "Preparing macOS icons..."
	if command -v iconutil &> /dev/null; then
		# Create iconset
		mkdir -p ponder.iconset
		convert "ponder-icon.png" -resize 16x16 "ponder.iconset/icon_16x16.png"
		convert "ponder-icon.png" -resize 32x32 "ponder.iconset/icon_16x16@2x.png"
		convert "ponder-icon.png" -resize 32x32 "ponder.iconset/icon_32x32.png"
		convert "ponder-icon.png" -resize 64x64 "ponder.iconset/icon_32x32@2x.png"
		convert "ponder-icon.png" -resize 128x128 "ponder.iconset/icon_128x128.png"
		convert "ponder-icon.png" -resize 256x256 "ponder.iconset/icon_128x128@2x.png"
		convert "ponder-icon.png" -resize 256x256 "ponder.iconset/icon_256x256.png"
		convert "ponder-icon.png" -resize 512x512 "ponder.iconset/icon_256x256@2x.png"
		convert "ponder-icon.png" -resize 512x512 "ponder.iconset/icon_512x512.png"
		convert "ponder-icon.png" -resize 1024x1024 "ponder.iconset/icon_512x512@2x.png"

		# Convert to icns
		iconutil -c icns ponder.iconset
		mv ponder.icns "resources/darwin/code.icns"
		rm -rf ponder.iconset
		echo "macOS icon conversion completed"
	else
		echo "Warning: iconutil not found, skipping macOS icon conversion"
		cp "ponder-icon.png" "resources/darwin/code.icns.png"
	fi

	echo "All icon conversions completed!"

else
	echo "Warning: ImageMagick not installed, only copying files"

	# Copy files directly, users need to manually convert
	cp "ponder-icon.png" "resources/win32/code.ico.png"
	cp "ponder-icon.png" "resources/win32/ponder_150x150.png"
	cp "ponder-icon.png" "resources/win32/ponder_70x70.png"
	cp "ponder-icon.png" "resources/darwin/code.icns.png"
	cp "ponder-icon.png" "resources/server/ponder-192.png"
	cp "ponder-icon.png" "resources/server/ponder-512.png"
	cp "ponder-icon.png" "resources/server/favicon.ico.png"

	echo ""
	echo "Notes:"
	echo "1. Please install ImageMagick to automatically convert icon formats"
	echo "2. Windows icons need to be converted to ICO format"
	echo "3. macOS icons need to be converted to ICNS format"
	echo "4. Web icons need to be resized to correct dimensions"
	echo ""
	echo "Install ImageMagick:"
	echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
	echo "  macOS: brew install imagemagick"
	echo "  CentOS/RHEL: sudo yum install ImageMagick"
fi

echo ""
echo "Icon file processing completed!"
