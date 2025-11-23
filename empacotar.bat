@echo off
echo =====================================
echo  Empacotamento Completo - .exe
echo =====================================
echo.

REM Criar pasta de distribuição
echo [1/5] Criando estrutura de distribuição...
if exist "dist" rmdir /s /q "dist"
mkdir "dist\analiseEnem"

REM Copiar o executável
echo [2/5] Copiando executável Windows...
copy "bin\neutralino-win_x64.exe" "dist\analiseEnem\analiseEnem.exe"

REM Criar resources.neu (arquivo de recursos)
echo [3/5] Criando arquivo de recursos...
neu build --release

REM Verificar se resources.neu foi criado em .tmp
if exist ".tmp\resources.neu" (
    copy ".tmp\resources.neu" "dist\analiseEnem\"
    echo ✓ resources.neu copiado
) else (
    echo [AVISO] resources.neu não encontrado em .tmp
    REM Tentar criar manualmente
    if exist ".tmp" (
        powershell Compress-Archive -Path ".tmp\*" -DestinationPath "dist\analiseEnem\resources.neu" -Force
        echo ✓ resources.neu criado manualmente
    )
)

REM Criar pasta de storage
echo [4/5] Criando pasta de armazenamento...
mkdir "dist\analiseEnem\storage"

REM Criar arquivo README
echo [5/5] Criando documentação...
(
echo =====================================
echo   Calendário de Estudos ENEM 2026
echo =====================================
echo.
echo Como usar:
echo 1. Execute: analiseEnem.exe
echo 2. Seus dados ficam salvos na pasta "storage"
echo.
echo Arquivos importantes:
echo - analiseEnem.exe      : O aplicativo
echo - resources.neu        : Recursos do app
echo - storage/             : Seus dados salvos
echo.
echo Requisitos:
echo - Windows 10/11
echo - Microsoft Edge WebView2 ^(já vem no Windows^)
echo.
echo =====================================
) > "dist\analiseEnem\LEIA-ME.txt"

echo.
echo =====================================
echo  Empacotamento concluído! ✓
echo =====================================
echo.
echo Seu aplicativo está em:
echo   dist\analiseEnem\
echo.
echo Arquivos gerados:
dir /b "dist\analiseEnem"
echo.
echo Para distribuir, copie toda a pasta "analiseEnem"
echo.
pause
