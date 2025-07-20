@echo off
setlocal

title Ponder IDE Dev

pushd %~dp0

echo Starting Ponder IDE...

:: Set environment variables
set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1

:: Skip prelaunch check (avoid extension download failures)
set VSCODE_SKIP_PRELAUNCH=1

:: Start Ponder IDE
".build\electron\Code - OSS.exe" . --disable-extension=vscode.vscode-api-tests

popd
endlocal
