# Sequence Renamer - Premiere Pro Extension

CEP Extension for Adobe Premiere Pro 25.5+ that automatically renames template sequences based on the parent folder name of the project.

## 📋 Features

- ✅ **Automatic mode**: Renames the sequence on extension startup (can be enabled/disabled)
- ✅ **Manual mode**: Button to trigger renaming at any time
- ✅ **Preferences saved**: Toggle state is remembered
- ✅ **Mac & Windows compatible**: Automatic handling of `/` and `\` paths
- ✅ **Modern interface**: Dark design adapted to Premiere Pro

## 🎯 How it works

The extension searches for a sequence named **"Nomme ta séquence ! 1080P25"** and renames it with the parent folder name of the project.

**Example structure:**
```
12 01 Project Name/
├── MEDIAS/
├── ELEMENTS/
└── PROJECT/
    └── Projectname.prproj
```

The sequence will be renamed to: **"12 01 Project Name"**

## 📦 Installation

### Mac
1. Copy the `PremiereSequenceRenamer` folder to:
   ```
   ~/Library/Application Support/Adobe/CEP/extensions/
   ```

2. Enable debug mode:
   - Open Terminal
   - Run:
     ```bash
     defaults write com.adobe.CSXS.11 PlayerDebugMode 1
     ```

### Windows
1. Copy the `PremiereSequenceRenamer` folder to:
   ```
   C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\
   ```

2. Enable debug mode:
   - Open Registry Editor (regedit)
   - Navigate to: `HKEY_CURRENT_USER\Software\Adobe\CSXS.11`
   - Create a new `String` key named `PlayerDebugMode` with value `1`

### Verify installation
1. Restart Premiere Pro
2. Go to **Window > Extensions > Sequence Renamer**
3. The extension should appear

## 🚀 Usage

### Automatic mode
1. Open the extension (**Window > Extensions > Sequence Renamer**)
2. Enable the toggle **"Auto-rename at startup"**
3. Each time the extension opens, the sequence will be automatically renamed if it exists

### Manual mode
1. Open the extension
2. Click the button **"Rename sequence"**
3. A confirmation message will appear

## 🔧 Project structure

```
PremiereSequenceRenamer/
├── .debug                    # Debug configuration
├── CSXS/
│   └── manifest.xml         # CEP manifest
├── client/
│   ├── index.html           # User interface
│   ├── styles.css           # Styles
│   └── main.js              # Client logic
└── host/
    ├── host.jsx             # ExtendScript (Premiere API)
    └── CSInterface.js       # Adobe CEP library
```

## ⚙️ Configuration

### Template sequence name
By default, the extension searches for: `"Nomme ta séquence ! 1080P25"`

To change this name, edit the file `host/host.jsx` line 38:
```javascript
var templateName = "Your new name";
```

### Folder structure
The extension assumes the project is in a subfolder (e.g., `PROJECT/`) of the parent folder to use for renaming.

If your structure is different, modify the logic in `extractParentFolderName()` in `host/host.jsx`.

## 🐛 Troubleshooting

### Extension doesn't appear in the menu
- Check that debug mode is enabled
- Check that the folder is in the `extensions` directory
- Restart Premiere Pro

### "No project open"
- Make sure a project is open in Premiere Pro
- The project must be saved at least once

### "Template sequence not found"
- Check that the sequence name exactly matches `"Nomme ta séquence ! 1080P25"`
- Uppercase, spaces, and special characters must be identical

### "Cannot extract parent folder name"
- Check that your project is in a folder structure
- The project must be at least 2 levels deep (e.g., `Parent/PROJECT/file.prproj`)

## 📝 Notes

- The extension only modifies the sequence with the exact template name
- If no sequence matches, nothing happens
- Renaming is instant and cannot be undone (use Ctrl+Z in Premiere)
- Compatible with Premiere Pro 25.5 and later versions

## 👨‍💻 Development

To modify the extension:
1. Edit files in the installation folder
2. Reload the extension in Premiere Pro (close and reopen the panel)
3. Check the debug console: `http://localhost:8088` in Chrome

## 📄 License

© 2025 AVSupport. All rights reserved.

---

# 🇫🇷 Version Française

---

# Sequence Renamer - Extension Premiere Pro

Extension CEP pour Adobe Premiere Pro 25.5+ qui renomme automatiquement les séquences template en fonction du nom du dossier parent du projet.

## 📋 Fonctionnalités

- ✅ **Mode automatique** : Renomme la séquence au démarrage de l'extension (activable/désactivable)
- ✅ **Mode manuel** : Bouton pour déclencher le renommage à tout moment
- ✅ **Sauvegarde des préférences** : L'état du toggle est mémorisé
- ✅ **Compatible Mac & Windows** : Gestion automatique des chemins `/` et `\`
- ✅ **Interface moderne** : Design sombre adapté à Premiere Pro

## 🎯 Fonctionnement

L'extension recherche une séquence nommée **"Nomme ta séquence ! 1080P25"** et la renomme avec le nom du dossier parent du projet.

**Exemple de structure :**
```
12 01 Nom projet/
├── MEDIAS/
├── ELEMENTS/
└── PROJET/
    └── Nomprojet.prproj
```

La séquence sera renommée en : **"12 01 Nom projet"**

## 📦 Installation

### Mac
1. Copiez le dossier `PremiereSequenceRenamer` dans :
   ```
   ~/Library/Application Support/Adobe/CEP/extensions/
   ```

2. Activez le mode debug :
   - Ouvrez le Terminal
   - Exécutez :
     ```bash
     defaults write com.adobe.CSXS.11 PlayerDebugMode 1
     ```

### Windows
1. Copiez le dossier `PremiereSequenceRenamer` dans :
   ```
   C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\
   ```

2. Activez le mode debug :
   - Ouvrez l'Éditeur de Registre (regedit)
   - Naviguez vers : `HKEY_CURRENT_USER\Software\Adobe\CSXS.11`
   - Créez une nouvelle clé `String` nommée `PlayerDebugMode` avec la valeur `1`

### Vérification de l'installation
1. Redémarrez Premiere Pro
2. Allez dans **Fenêtre > Extensions > Sequence Renamer**
3. L'extension devrait s'afficher

## 🚀 Utilisation

### Mode automatique
1. Ouvrez l'extension (**Fenêtre > Extensions > Sequence Renamer**)
2. Activez le toggle **"Auto-rename au démarrage"**
3. À chaque ouverture de l'extension, la séquence sera automatiquement renommée si elle existe

### Mode manuel
1. Ouvrez l'extension
2. Cliquez sur le bouton **"Renommer la séquence"**
3. Un message de confirmation s'affichera

## 🔧 Structure du projet

```
PremiereSequenceRenamer/
├── .debug                    # Configuration debug
├── CSXS/
│   └── manifest.xml         # Manifeste CEP
├── client/
│   ├── index.html           # Interface utilisateur
│   ├── styles.css           # Styles
│   └── main.js              # Logique client
└── host/
    ├── host.jsx             # Script ExtendScript (API Premiere)
    └── CSInterface.js       # Bibliothèque Adobe CEP
```

## ⚙️ Configuration

### Nom de la séquence template
Par défaut, l'extension recherche : `"Nomme ta séquence ! 1080P25"`

Pour modifier ce nom, éditez le fichier `host/host.jsx` ligne 38 :
```javascript
var templateName = "Votre nouveau nom";
```

### Structure de dossiers
L'extension suppose que le projet est dans un sous-dossier (ex: `PROJET/`) du dossier parent à utiliser pour le renommage.

Si votre structure est différente, modifiez la logique dans `extractParentFolderName()` dans `host/host.jsx`.

## 🐛 Dépannage

### L'extension n'apparaît pas dans le menu
- Vérifiez que le mode debug est activé
- Vérifiez que le dossier est bien dans le répertoire `extensions`
- Redémarrez Premiere Pro

### "Aucun projet ouvert"
- Assurez-vous qu'un projet est bien ouvert dans Premiere Pro
- Le projet doit être sauvegardé au moins une fois

### "Séquence template not found"
- Vérifiez que le nom de la séquence correspond exactement à `"Nomme ta séquence ! 1080P25"`
- Les majuscules, espaces et caractères spéciaux doivent être identiques

### "Impossible d'extraire le nom du dossier parent"
- Vérifiez que votre projet est bien dans une structure de dossiers
- Le projet doit être au moins 2 niveaux de profondeur (ex: `Parent/PROJET/fichier.prproj`)

## 📝 Notes

- L'extension ne modifie que la séquence avec le nom template exact
- Si aucune séquence ne correspond, rien ne se passe
- Le renommage est instantané et ne peut pas être annulé (utilisez Ctrl+Z dans Premiere)
- Compatible avec Premiere Pro 25.5 et versions ultérieures

## 👨‍💻 Développement

Pour modifier l'extension :
1. Éditez les fichiers dans le dossier d'installation
2. Rechargez l'extension dans Premiere Pro (fermez et rouvrez le panneau)
3. Consultez la console de debug : `http://localhost:8088` dans Chrome

## 📄 Licence

© 2025 AVSupport. Tous droits réservés.
