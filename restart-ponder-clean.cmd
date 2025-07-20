@echo off
echo Restarting Ponder IDE with clean user data...

echo.
echo Step 1: Closing any existing Ponder IDE processes...
taskkill /F /IM "Code - OSS.exe" 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Starting Ponder IDE with temporary user data...
set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set ELECTRON_ENABLE_LOGGING=1
set VSCODE_SKIP_PRELAUNCH=1

echo Step 3: Launching application...
".build\electron\Code - OSS.exe" test-workspace --user-data-dir="%TEMP%\ponder-clean" --new-window --disable-extension=vscode.vscode-api-tests

echo.
echo Ponder IDE should now be running with clean settings.
echo If you still see an empty interface, try:
echo 1. Press Ctrl+Shift+E to show the file explorer
echo 2. Press Ctrl+B to toggle the sidebar
echo 3. Press F12 to open developer tools and check for errors
