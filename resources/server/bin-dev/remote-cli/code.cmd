@echo off
setlocal
SET PONDER_PATH=%~dp0..\..\..\..
SET PONDER_DEV=1
FOR /F "tokens=* USEBACKQ" %%g IN (`where /r "%PONDER_PATH%\.build\node" node.exe`) do (SET "NODE=%%g")
call "%NODE%" "%PONDER_PATH%\out\server-cli.js" "Ponder Server - Dev" "" "" "ponder.cmd" %*
endlocal
