@echo off
REM Installation script for Sequence Renamer Extension (Windows)
REM This script copies the extension to the Adobe CEP extensions folder

echo.
echo ================================
echo Sequence Renamer - Installation
echo ================================
echo.

REM Define paths
set EXTENSION_NAME=PremiereSequenceRenamer
set SOURCE_DIR=%~dp0
set TARGET_DIR=%CommonProgramFiles(x86)%\Adobe\CEP\extensions\%EXTENSION_NAME%

REM Create extensions directory if it doesn't exist
echo [1/3] Creation du repertoire d'extensions...
if not exist "%CommonProgramFiles(x86)%\Adobe\CEP\extensions" (
    mkdir "%CommonProgramFiles(x86)%\Adobe\CEP\extensions"
)

REM Copy extension
echo [2/3] Copie de l'extension...
if exist "%TARGET_DIR%" (
    echo L'extension existe deja. Remplacement...
    rmdir /s /q "%TARGET_DIR%"
)

xcopy /E /I /Y "%SOURCE_DIR%" "%TARGET_DIR%"

REM Enable debug mode (requires admin rights)
echo [3/3] Activation du mode debug...
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.11 /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1

echo.
echo ================================
echo Installation terminee !
echo ================================
echo.
echo Prochaines etapes :
echo   1. Redemarrez Adobe Premiere Pro
echo   2. Allez dans Fenetre ^> Extensions ^> Sequence Renamer
echo.
echo Pour desinstaller :
echo   rmdir /s /q "%TARGET_DIR%"
echo.
pause
