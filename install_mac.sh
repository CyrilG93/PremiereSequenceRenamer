#!/bin/bash

# Installation script for Sequence Renamer Extension (Mac)
# This script copies the extension to the Adobe CEP extensions folder

echo "🚀 Installation de Sequence Renamer pour Adobe Premiere Pro"
echo ""

# Define paths
EXTENSION_NAME="PremiereSequenceRenamer"
SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions/$EXTENSION_NAME"

# Create extensions directory if it doesn't exist
echo "📁 Création du répertoire d'extensions..."
mkdir -p "$HOME/Library/Application Support/Adobe/CEP/extensions"

# Copy extension
echo "📦 Copie de l'extension..."
if [ -d "$TARGET_DIR" ]; then
    echo "⚠️  L'extension existe déjà. Remplacement..."
    rm -rf "$TARGET_DIR"
fi

cp -R "$SOURCE_DIR" "$TARGET_DIR"

# Enable debug mode
echo "🔧 Activation du mode debug..."
defaults write com.adobe.CSXS.11 PlayerDebugMode 1

echo ""
echo "✅ Installation terminée !"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Redémarrez Adobe Premiere Pro"
echo "   2. Allez dans Fenêtre > Extensions > Sequence Renamer"
echo ""
echo "💡 Pour désinstaller :"
echo "   rm -rf \"$TARGET_DIR\""
echo ""
