@echo off
REM =============================================================================
REM Sequence Renamer - Installation Script (Windows)
REM Extension CEP for Adobe Premiere Pro
REM =============================================================================
REM EN: This script installs the Sequence Renamer extension for Premiere Pro
REM FR: Ce script installe l'extension Sequence Renamer pour Premiere Pro
REM =============================================================================

echo.
echo ==============================================
echo   Sequence Renamer - Installation (Windows)
echo ==============================================
echo.

REM Define paths / Definition des chemins
set EXTENSION_NAME=PremiereSequenceRenamer
set SOURCE_DIR=%~dp0
set TARGET_DIR=%CommonProgramFiles(x86)%\Adobe\CEP\extensions\%EXTENSION_NAME%

REM Create extensions directory / Creation du repertoire d'extensions
echo [1/3] Creating extensions directory...
echo       Creation du repertoire d'extensions...
if not exist "%CommonProgramFiles(x86)%\Adobe\CEP\extensions" (
    mkdir "%CommonProgramFiles(x86)%\Adobe\CEP\extensions"
)

REM Copy extension / Copie de l'extension
echo [2/3] Copying extension...
echo       Copie de l'extension...
if exist "%TARGET_DIR%" (
    echo       Extension exists. Replacing... / L'extension existe. Remplacement...
    rmdir /s /q "%TARGET_DIR%"
)

xcopy /E /I /Y "%SOURCE_DIR%" "%TARGET_DIR%"

REM Enable debug mode / Activation du mode debug
echo [3/3] Enabling debug mode...
echo       Activation du mode debug...
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.11 /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1

echo.
echo ==============================================
echo   Installation complete! / Installation terminee !
echo ==============================================
echo.
echo Next steps / Prochaines etapes:
echo   1. Restart Adobe Premiere Pro / Redemarrez Adobe Premiere Pro
echo   2. Go to Window ^> Extensions ^> Sequence Renamer
echo      Allez dans Fenetre ^> Extensions ^> Sequence Renamer
echo.
echo To uninstall / Pour desinstaller:
echo   rmdir /s /q "%TARGET_DIR%"
echo.
pause
