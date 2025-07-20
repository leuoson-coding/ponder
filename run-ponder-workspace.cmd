@echo off
echo Starting Ponder IDE with test workspace...

set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set ELECTRON_ENABLE_LOGGING=1
set VSCODE_SKIP_PRELAUNCH=1

echo Environment variables set.
echo.
echo Opening test workspace in Ponder IDE...
echo Current directory: %CD%
echo Target workspace: %CD%\test-workspace

".build\electron\Code - OSS.exe" --folder-uri="file:///%CD:\=/%/test-workspace" --new-window --disable-extension=vscode.vscode-api-tests

echo.
echo Ponder IDE should now be running with the test workspace.
echo If the interface appears empty, try:
echo 1. Press Ctrl+R to refresh
echo 2. Press Ctrl+Shift+E to show Explorer
echo 3. Press F12 to open Developer Tools
