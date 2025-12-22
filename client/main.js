// CSInterface wrapper for communication with Premiere Pro
var csInterface = new CSInterface();

// DOM elements
var autoRenameToggle;
var renameBtn;
var statusMessage;
var templateNameInput;
var folderDepthInput;

// Settings key for localStorage
var SETTINGS_KEY = 'sequenceRenamer_settings';

// Default values
var DEFAULT_TEMPLATE_NAME = "Nomme ta séquence ! 1080P25";
var DEFAULT_FOLDER_DEPTH = 2;

// Initialize extension
function init() {
    // Get DOM elements
    autoRenameToggle = document.getElementById('autoRenameToggle');
    renameBtn = document.getElementById('renameBtn');
    statusMessage = document.getElementById('statusMessage');
    templateNameInput = document.getElementById('templateName');
    folderDepthInput = document.getElementById('folderDepth');

    // Load saved settings
    loadSettings();

    // Event listeners
    autoRenameToggle.addEventListener('change', onToggleChange);
    renameBtn.addEventListener('click', onRenameClick);

    // Settings change listeners
    if (templateNameInput) {
        templateNameInput.addEventListener('change', saveSettings);
        templateNameInput.addEventListener('blur', saveSettings);
    }
    if (folderDepthInput) {
        folderDepthInput.addEventListener('change', saveSettings);
        folderDepthInput.addEventListener('blur', saveSettings);
    }

    // Check if auto-rename is enabled and execute on startup
    if (autoRenameToggle.checked) {
        setTimeout(function () {
            executeRename(true); // true = auto mode
        }, 500); // Small delay to ensure Premiere is ready
    }
}

// Load settings from localStorage
function loadSettings() {
    try {
        var settings = localStorage.getItem(SETTINGS_KEY);
        if (settings) {
            var parsed = JSON.parse(settings);
            autoRenameToggle.checked = parsed.autoRename || false;

            if (templateNameInput) {
                templateNameInput.value = parsed.templateName || DEFAULT_TEMPLATE_NAME;
            }
            if (folderDepthInput) {
                folderDepthInput.value = parsed.folderDepth !== undefined ? parsed.folderDepth : DEFAULT_FOLDER_DEPTH;
            }
        } else {
            // Set defaults
            if (templateNameInput) {
                templateNameInput.value = DEFAULT_TEMPLATE_NAME;
            }
            if (folderDepthInput) {
                folderDepthInput.value = DEFAULT_FOLDER_DEPTH;
            }
        }
    } catch (e) {
        console.error('Error loading settings:', e);
    }
}

// Save settings to localStorage
function saveSettings() {
    try {
        var settings = {
            autoRename: autoRenameToggle.checked,
            templateName: templateNameInput ? templateNameInput.value : DEFAULT_TEMPLATE_NAME,
            folderDepth: folderDepthInput ? parseInt(folderDepthInput.value, 10) : DEFAULT_FOLDER_DEPTH
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error('Error saving settings:', e);
    }
}

// Get current settings
function getCurrentSettings() {
    return {
        templateName: templateNameInput ? templateNameInput.value : DEFAULT_TEMPLATE_NAME,
        folderDepth: folderDepthInput ? parseInt(folderDepthInput.value, 10) : DEFAULT_FOLDER_DEPTH
    };
}

// Handle toggle change
function onToggleChange() {
    saveSettings();

    if (autoRenameToggle.checked) {
        showStatus('Mode automatique activé', 'success');
    } else {
        showStatus('Mode automatique désactivé', 'info');
    }
}

// Handle manual rename button click
function onRenameClick() {
    executeRename(false); // false = manual mode
}

// Execute the rename operation
function executeRename(isAutoMode) {
    // Disable button during execution
    renameBtn.disabled = true;
    var originalHTML = renameBtn.innerHTML;
    renameBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/><path d="M8 2 A6 6 0 0 1 14 8" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg><span class="button-text">En cours</span>';

    // Get current settings
    var settings = getCurrentSettings();

    // Build script call with parameters
    var scriptCall = 'renameSequence("' +
        settings.templateName.replace(/"/g, '\\"') + '", ' +
        settings.folderDepth + ')';

    // Call ExtendScript function with parameters
    csInterface.evalScript(scriptCall, function (result) {
        // Re-enable button
        renameBtn.disabled = false;
        renameBtn.innerHTML = originalHTML;

        // Parse result
        try {
            var response = JSON.parse(result);

            if (response.success) {
                showStatus('✓ Séquence renommée: "' + response.newName + '"', 'success');
            } else {
                // Only show error if not in auto mode or if it's a real error
                if (!isAutoMode || response.error.indexOf('not found') === -1) {
                    showStatus('⚠ ' + response.error, 'error');
                } else {
                    // In auto mode, silently ignore "not found" errors
                    console.log('Auto-rename: No template sequence found');
                }
            }
        } catch (e) {
            showStatus('⚠ Erreur: ' + result, 'error');
        }
    });
}

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message show ' + type;

    // Auto-hide after 5 seconds
    setTimeout(function () {
        statusMessage.classList.remove('show');
    }, 5000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
