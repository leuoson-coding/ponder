@echo off
echo Starting Ponder IDE (Simple)...

set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set ELECTRON_ENABLE_LOGGING=1
set VSCODE_SKIP_PRELAUNCH=1

echo Environment variables set.
echo.
echo Starting Ponder IDE without specific workspace...
echo You can open the test-workspace folder after startup using File > Open Folder

".build\electron\Code - OSS.exe" . --new-window --disable-extension=vscode.vscode-api-tests

echo.
echo Ponder IDE should now be running.
echo To open the test workspace:
echo 1. Use File > Open Folder
echo 2. Navigate to: %CD%\test-workspace
echo 3. Click "Select Folder"
