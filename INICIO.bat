@echo off
echo =====================================
echo  GUIA RÁPIDO - Gerar .exe
echo =====================================
echo.
echo Este guia vai te ajudar a transformar seu
echo aplicativo em um executável .exe
echo.
echo =====================================
echo.
echo PASSO 1: Verificar Node.js
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Node.js instalado
    node --version
) else (
    echo ✗ Node.js NÃO instalado
    echo.
    echo Baixe em: https://nodejs.org/
    echo Após instalar, execute este script novamente
    pause
    exit /b 1
)

echo.
echo =====================================
echo PASSO 2: Verificar Neutralino CLI
echo.

where neu >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Neutralino CLI instalado
    neu version
    goto :build
) else (
    echo ✗ Neutralino CLI NÃO instalado
    echo.
    choice /C SN /M "Deseja instalar agora"
    if errorlevel 2 goto :manual
    if errorlevel 1 goto :install
)

:install
echo.
echo Instalando Neutralino CLI...
call setup.bat
goto :build

:manual
echo.
echo Para instalar manualmente, execute:
echo npm install -g @neutralinojs/neu
echo.
pause
exit /b 0

:build
echo.
echo =====================================
echo PASSO 3: Gerar o executável
echo.
choice /C SN /M "Deseja gerar o .exe agora"
if errorlevel 2 goto :end
if errorlevel 1 goto :dobuild

:dobuild
echo.
call build.bat
goto :end

:end
echo.
echo =====================================
echo.
echo Para gerar o .exe no futuro, execute:
echo   build.bat
echo.
echo O executável ficará em:
echo   dist\analiseEnem\analiseEnem-win_x64.exe
echo.
pause
