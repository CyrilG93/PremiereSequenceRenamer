// Premiere Pro ExtendScript for Sequence Renaming
// This script runs in the ExtendScript context and has access to Premiere Pro API

/**
 * Main function to rename the template sequence
 * @returns {string} JSON string with success status and message
 */
function renameSequence() {
    try {
        // Check if a project is open
        if (!app.project || !app.project.rootItem) {
            return JSON.stringify({
                success: false,
                error: "Aucun projet ouvert"
            });
        }

        // Get project path
        var projectPath = app.project.path;
        if (!projectPath) {
            return JSON.stringify({
                success: false,
                error: "Le projet n'a pas encore été sauvegardé"
            });
        }

        // Extract parent folder name from project path
        var parentFolderName = extractParentFolderName(projectPath);
        if (!parentFolderName) {
            return JSON.stringify({
                success: false,
                error: "Impossible d'extraire le nom du dossier parent"
            });
        }

        // Find the template sequence
        var templateName = "Nomme ta séquence ! 1080P25";
        var targetSequence = findSequenceByName(templateName);

        if (!targetSequence) {
            return JSON.stringify({
                success: false,
                error: "Séquence template '" + templateName + "' not found"
            });
        }

        // Rename the sequence
        targetSequence.name = parentFolderName;

        return JSON.stringify({
            success: true,
            newName: parentFolderName,
            message: "Séquence renommée avec succès"
        });

    } catch (e) {
        return JSON.stringify({
            success: false,
            error: "Erreur: " + e.toString()
        });
    }
}

/**
 * Extract parent folder name from project path
 * Handles both Mac (/) and Windows (\) path separators
 * @param {string} projectPath - Full path to the project file
 * @returns {string} Parent folder name or null
 */
function extractParentFolderName(projectPath) {
    try {
        // Determine path separator based on OS
        var separator = "/";
        if ($.os.indexOf("Windows") !== -1) {
            separator = "\\";
        }

        // Normalize path separators
        var normalizedPath = projectPath.replace(/\\/g, separator).replace(/\//g, separator);

        // Split path into parts
        var pathParts = normalizedPath.split(separator);

        // Remove empty parts
        var cleanParts = [];
        for (var i = 0; i < pathParts.length; i++) {
            if (pathParts[i] && pathParts[i].length > 0) {
                cleanParts.push(pathParts[i]);
            }
        }

        // The structure is: ParentFolder/PROJET/project.prproj
        // So we need to go back 2 levels from the project file
        if (cleanParts.length >= 3) {
            // Get the parent folder (2 levels up from the .prproj file)
            return cleanParts[cleanParts.length - 3];
        }

        return null;
    } catch (e) {
        return null;
    }
}

/**
 * Find a sequence by name in the project
 * @param {string} sequenceName - Name of the sequence to find
 * @returns {Sequence} Sequence object or null
 */
function findSequenceByName(sequenceName) {
    try {
        var numSequences = app.project.sequences.numSequences;

        for (var i = 0; i < numSequences; i++) {
            var sequence = app.project.sequences[i];
            if (sequence.name === sequenceName) {
                return sequence;
            }
        }

        return null;
    } catch (e) {
        return null;
    }
}

/**
 * Get all sequences in the project (for debugging)
 * @returns {string} JSON string with list of sequence names
 */
function listAllSequences() {
    try {
        var sequences = [];
        var numSequences = app.project.sequences.numSequences;

        for (var i = 0; i < numSequences; i++) {
            sequences.push(app.project.sequences[i].name);
        }

        return JSON.stringify({
            success: true,
            sequences: sequences,
            count: numSequences
        });
    } catch (e) {
        return JSON.stringify({
            success: false,
            error: e.toString()
        });
    }
}
