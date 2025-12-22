/**
 * Sequence Renamer - Premiere Pro Extension
 * Main JavaScript file with internationalization (i18n) support
 */

// CSInterface wrapper for communication with Premiere Pro
var csInterface = new CSInterface();

// DOM elements
var autoRenameToggle;
var renameBtn;
var statusMessage;
var templateNameInput;
var folderDepthInput;
var languageSelect;

// Settings key for localStorage
var SETTINGS_KEY = 'sequenceRenamer_settings';

// Default values
var DEFAULT_TEMPLATE_NAME = "";  // Empty by default on first install
var DEFAULT_FOLDER_DEPTH = 2;
var DEFAULT_LANGUAGE = "en";  // English by default

// Current translations
var translations = {};
var currentLang = DEFAULT_LANGUAGE;

/**
 * Initialize extension
 */
function init() {
    // Get DOM elements
    autoRenameToggle = document.getElementById('autoRenameToggle');
    renameBtn = document.getElementById('renameBtn');
    statusMessage = document.getElementById('statusMessage');
    templateNameInput = document.getElementById('templateName');
    folderDepthInput = document.getElementById('folderDepth');
    languageSelect = document.getElementById('languageSelect');

    // Load saved settings first (to get language preference)
    loadSettings();

    // Load translations then update UI
    loadTranslations(currentLang, function () {
        applyTranslations();

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
        if (languageSelect) {
            languageSelect.addEventListener('change', onLanguageChange);
        }

        // Check if auto-rename is enabled and execute on startup
        if (autoRenameToggle.checked) {
            setTimeout(function () {
                executeRename(true);  // true = auto mode
            }, 500);  // Small delay to ensure Premiere is ready
        }
    });
}

/**
 * Load translations from JSON file
 * @param {string} lang - Language code (e.g., 'en', 'fr')
 * @param {function} callback - Callback function after loading
 */
function loadTranslations(lang, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'lang/' + lang + '.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    translations = JSON.parse(xhr.responseText);
                    currentLang = lang;
                } catch (e) {
                    console.error('Error parsing translations:', e);
                }
            } else {
                console.error('Error loading translations:', xhr.status);
            }
            if (callback) callback();
        }
    };
    xhr.send();
}

/**
 * Get translation by key path (e.g., 'settings.templateName')
 * @param {string} key - Translation key path
 * @returns {string} Translated text or key if not found
 */
function t(key) {
    var keys = key.split('.');
    var value = translations;
    for (var i = 0; i < keys.length; i++) {
        if (value && value[keys[i]]) {
            value = value[keys[i]];
        } else {
            return key;  // Return key if translation not found
        }
    }
    return value;
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
    // Update elements with data-i18n attribute
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-i18n');
        elements[i].textContent = t(key);
    }

    // Update placeholders
    var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < placeholders.length; j++) {
        var placeholderKey = placeholders[j].getAttribute('data-i18n-placeholder');
        placeholders[j].placeholder = t(placeholderKey);
    }

    // Update language selector value
    if (languageSelect) {
        languageSelect.value = currentLang;
    }

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
}

/**
 * Handle language change
 */
function onLanguageChange() {
    var newLang = languageSelect.value;
    loadTranslations(newLang, function () {
        applyTranslations();
        saveSettings();
    });
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    try {
        var settings = localStorage.getItem(SETTINGS_KEY);
        if (settings) {
            var parsed = JSON.parse(settings);
            autoRenameToggle.checked = parsed.autoRename || false;

            if (templateNameInput) {
                templateNameInput.value = parsed.templateName !== undefined ? parsed.templateName : DEFAULT_TEMPLATE_NAME;
            }
            if (folderDepthInput) {
                folderDepthInput.value = parsed.folderDepth !== undefined ? parsed.folderDepth : DEFAULT_FOLDER_DEPTH;
            }
            // Load language preference
            currentLang = parsed.language || DEFAULT_LANGUAGE;
        } else {
            // First install - set defaults
            if (templateNameInput) {
                templateNameInput.value = DEFAULT_TEMPLATE_NAME;
            }
            if (folderDepthInput) {
                folderDepthInput.value = DEFAULT_FOLDER_DEPTH;
            }
            currentLang = DEFAULT_LANGUAGE;
        }
    } catch (e) {
        console.error('Error loading settings:', e);
    }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    try {
        var settings = {
            autoRename: autoRenameToggle.checked,
            templateName: templateNameInput ? templateNameInput.value : DEFAULT_TEMPLATE_NAME,
            folderDepth: folderDepthInput ? parseInt(folderDepthInput.value, 10) : DEFAULT_FOLDER_DEPTH,
            language: currentLang
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error('Error saving settings:', e);
    }
}

/**
 * Get current settings
 * @returns {object} Current settings object
 */
function getCurrentSettings() {
    return {
        templateName: templateNameInput ? templateNameInput.value : DEFAULT_TEMPLATE_NAME,
        folderDepth: folderDepthInput ? parseInt(folderDepthInput.value, 10) : DEFAULT_FOLDER_DEPTH
    };
}

/**
 * Handle toggle change
 */
function onToggleChange() {
    saveSettings();

    if (autoRenameToggle.checked) {
        showStatus('✓ ' + t('messages.autoEnabled'), 'success');
    } else {
        showStatus(t('messages.autoDisabled'), 'info');
    }
}

/**
 * Handle manual rename button click
 */
function onRenameClick() {
    executeRename(false);  // false = manual mode
}

/**
 * Execute the rename operation
 * @param {boolean} isAutoMode - Whether this is auto mode
 */
function executeRename(isAutoMode) {
    // Disable button during execution
    renameBtn.disabled = true;
    var originalHTML = renameBtn.innerHTML;
    renameBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/><path d="M8 2 A6 6 0 0 1 14 8" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg><span class="button-text">' + t('renameInProgress') + '</span>';

    // Get current settings
    var settings = getCurrentSettings();

    // Check if template name is set
    if (!settings.templateName || settings.templateName.trim() === '') {
        renameBtn.disabled = false;
        renameBtn.innerHTML = originalHTML;
        if (!isAutoMode) {
            showStatus('⚠ ' + t('errors.sequenceNotFound'), 'error');
        }
        return;
    }

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
                showStatus('✓ ' + t('messages.renamed') + ' "' + response.newName + '"', 'success');
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
            showStatus('⚠ ' + t('messages.error') + ' ' + result, 'error');
        }
    });
}

/**
 * Show status message
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, error, info)
 */
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
