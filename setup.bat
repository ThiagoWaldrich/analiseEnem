@echo off
echo =====================================
echo  Setup - Neutralino CLI
echo =====================================
echo.

REM Verificar se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js não está instalado!
    echo.
    echo Por favor, instale o Node.js primeiro:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado: 
node --version
echo.

REM Verificar se o npm está disponível
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] npm não encontrado!
    pause
    exit /b 1
)

echo npm encontrado:
npm --version
echo.

echo [1/2] Instalando Neutralino CLI...
echo.
npm install -g @neutralinojs/neu

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao instalar Neutralino CLI!
    echo.
    echo Tente executar como Administrador ou execute:
    echo npm install -g @neutralinojs/neu
    echo.
    pause
    exit /b 1
)

echo.
echo [2/2] Verificando instalação...
neu version

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Neutralino CLI instalado mas não encontrado no PATH
    echo Tente fechar e abrir o terminal novamente
    echo.
    pause
    exit /b 0
)

echo.
echo =====================================
echo  Setup concluído com sucesso! ✓
echo =====================================
echo.
echo Próximos passos:
echo 1. Execute: build.bat
echo 2. Seu .exe estará em: dist\analiseEnem\
echo.
pause
