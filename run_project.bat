@echo off
echo Starting AtlasSocial Project...

:: Start Laravel Backend
start "Laravel Backend" cmd /k "php artisan serve"

:: Start Vite Frontend
start "Vite Frontend" cmd /k ".\node_modules\.bin\vite.cmd"

:: Start Reverb WebSocket Server
start "Reverb WebSocket" cmd /k "php artisan reverb:start"

echo All services are starting in separate windows.
echo Access the app at http://localhost:8000
pause
