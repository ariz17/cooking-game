@echo off
echo Refreshing VSCode and clearing cache...

:: Kill any running VSCode instances for this folder
taskkill /f /im code.exe >nul 2>&1

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Clear VSCode cache folders
echo Clearing VSCode cache...
if exist "%APPDATA%\Code\Cache" (
    rmdir /s /q "%APPDATA%\Code\Cache"
    echo Cleared VSCode cache.
)

if exist "%APPDATA%\Code\CachedData" (
    rmdir /s /q "%APPDATA%\Code\CachedData"
    echo Cleared VSCode cached data.
)

:: Clear VSCode workspace storage
if exist "%APPDATA%\Code\User\workspaceStorage" (
    echo Clearing workspace storage...
    for /d %%i in ("%APPDATA%\Code\User\workspaceStorage\*") do (
        echo Checking %%i
        findstr /m "cooking-game" "%%i\workspace.json" >nul 2>&1
        if not errorlevel 1 (
            echo Found cooking-game workspace, clearing...
            rmdir /s /q "%%i"
        )
    )
)

:: Open VSCode with the project folder
echo Opening VSCode...
start code "c:\Users\asus\Desktop\cooking-game"

:: Wait for VSCode to open
timeout /t 3 /nobreak >nul

:: Open the key files
start code "c:\Users\asus\Desktop\cooking-game\backend\src\main\resources\application.properties"
start code "c:\Users\asus\Desktop\cooking-game\frontend\static\script.js"
start code "c:\Users\asus\Desktop\cooking-game\frontend\static\index.html"
start code "c:\Users\asus\Desktop\cooking-game\frontend\server.js"

echo Done! VSCode should now show the updated files.
echo If files still don't show updates, try these steps:

echo 1. Press Ctrl+Shift+P in VSCode
echo 2. Type "Developer: Reload Window" and press Enter
echo 3. Or try "File: Save All" followed by "File: Reopen Files"

pause