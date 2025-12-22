#!/bin/bash

# =============================================================================
# Sequence Renamer - Installation Script (macOS)
# Extension CEP for Adobe Premiere Pro
# =============================================================================
# EN: This script installs the Sequence Renamer extension for Premiere Pro
# FR: Ce script installe l'extension Sequence Renamer pour Premiere Pro
# =============================================================================

echo ""
echo "=============================================="
echo "  Sequence Renamer - Installation (macOS)"
echo "=============================================="
echo ""

# Define paths / Définition des chemins
EXTENSION_NAME="PremiereSequenceRenamer"
SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions/$EXTENSION_NAME"

# Create extensions directory / Création du répertoire d'extensions
echo "[1/3] Creating extensions directory..."
echo "      Création du répertoire d'extensions..."
mkdir -p "$HOME/Library/Application Support/Adobe/CEP/extensions"

# Copy extension / Copie de l'extension
echo "[2/3] Copying extension..."
echo "      Copie de l'extension..."
if [ -d "$TARGET_DIR" ]; then
    echo "      ⚠️  Extension exists. Replacing... / L'extension existe. Remplacement..."
    rm -rf "$TARGET_DIR"
fi

cp -R "$SOURCE_DIR" "$TARGET_DIR"

# Enable debug mode / Activation du mode debug
echo "[3/3] Enabling debug mode..."
echo "      Activation du mode debug..."
defaults write com.adobe.CSXS.11 PlayerDebugMode 1

echo ""
echo "=============================================="
echo "  ✅ Installation complete! / Installation terminée !"
echo "=============================================="
echo ""
echo "Next steps / Prochaines étapes:"
echo "  1. Restart Adobe Premiere Pro / Redémarrez Adobe Premiere Pro"
echo "  2. Go to Window > Extensions > Sequence Renamer"
echo "     Allez dans Fenêtre > Extensions > Sequence Renamer"
echo ""
echo "To uninstall / Pour désinstaller:"
echo "  rm -rf \"$TARGET_DIR\""
echo ""
