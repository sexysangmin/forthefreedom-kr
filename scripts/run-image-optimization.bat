@echo off
echo ========================================
echo        Image Optimization Script
echo ========================================

rem Change to the project root directory
cd /d "%~dp0.."

echo Current directory: %CD%
echo.

echo Installing required libraries...
pip install -r requirements-image.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install libraries
    pause
    exit /b 1
)

echo.
echo Starting image optimization...
py scripts/optimize-images.py
if %errorlevel% neq 0 (
    echo ERROR: Image optimization failed
    pause
    exit /b 1
)

echo.
echo Image optimization completed successfully!
echo Your website will now load much faster.
echo.
echo Press any key to continue...
pause > nul 