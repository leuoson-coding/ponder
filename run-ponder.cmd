@echo off
echo Starting Ponder IDE...

set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1
set VSCODE_SKIP_PRELAUNCH=1

echo Environment variables set:
echo NODE_ENV=%NODE_ENV%
echo VSCODE_DEV=%VSCODE_DEV%

echo.
echo Starting Electron application...
echo Opening current directory as workspace...
".build\electron\Code - OSS.exe" . --new-window --disable-extension=vscode.vscode-api-tests
