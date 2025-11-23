@echo off
echo =====================================
echo  Build - Calendário de Estudos ENEM
echo =====================================
echo.

REM Verificar se o Neutralino CLI está instalado
where neu >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Neutralino CLI não encontrado!
    echo.
    echo Para instalar o Neutralino CLI, execute:
    echo npm install -g @neutralinojs/neu
    echo.
    pause
    exit /b 1
)

echo [1/3] Criando build...
neu build

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao criar o build!
    pause
    exit /b 1
)

echo.
echo [2/3] Verificando arquivos gerados...
if exist "dist\analiseEnem" (
    echo ✓ Pasta dist criada com sucesso
) else (
    echo [ERRO] Pasta dist não foi criada!
    pause
    exit /b 1
)

echo.
echo [3/3] Build concluído!
echo.
echo O executável está em: dist\analiseEnem\
echo.
echo Arquivos gerados:
echo   - analiseEnem-win_x64.exe (Windows 64-bit)
echo.
echo =====================================
echo  Build finalizado com sucesso! ✓
echo =====================================
echo.
pause
