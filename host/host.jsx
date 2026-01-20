/**
 * Premiere Pro ExtendScript for Sequence Renaming
 * This script runs in the ExtendScript context and has access to Premiere Pro API
 * 
 * @author AVSupport
 * @version 1.1.0
 */

/**
 * Main function to rename the template sequence
 * @param {string} templateName - Name of the sequence to find and rename
 * @param {number} folderDepth - Number of folders to go up from project file (0 = same folder, 1 = parent, etc.)
 * @returns {string} JSON string with success status and message
 */
function SequenceRenamer_renameSequence(templateName, folderDepth) {
    try {
        // Validate template name
        if (!templateName || templateName === "") {
            return JSON.stringify({
                success: false,
                error: "Template sequence name is empty"
            });
        }

        // Validate and parse folder depth
        if (folderDepth === undefined || folderDepth === null || isNaN(folderDepth)) {
            folderDepth = 2;
        }
        folderDepth = parseInt(folderDepth, 10);

        // Check if a project is open
        if (!app.project || !app.project.rootItem) {
            return JSON.stringify({
                success: false,
                error: "No project open"
            });
        }

        // Get project path
        var projectPath = app.project.path;
        if (!projectPath) {
            return JSON.stringify({
                success: false,
                error: "Project has not been saved yet"
            });
        }

        // Extract parent folder name from project path
        var parentFolderName = SequenceRenamer_extractParentFolderName(projectPath, folderDepth);
        if (!parentFolderName) {
            return JSON.stringify({
                success: false,
                error: "Unable to extract folder name (depth: " + folderDepth + ")"
            });
        }

        // Find the template sequence
        var targetSequence = SequenceRenamer_findSequenceByName(templateName);

        if (!targetSequence) {
            return JSON.stringify({
                success: false,
                error: "Sequence '" + templateName + "' not found"
            });
        }

        // Rename the sequence
        targetSequence.name = parentFolderName;

        return JSON.stringify({
            success: true,
            newName: parentFolderName,
            message: "Sequence renamed successfully"
        });

    } catch (e) {
        return JSON.stringify({
            success: false,
            error: "Error: " + e.toString()
        });
    }
}

/**
 * Extract parent folder name from project path
 * Handles both Mac (/) and Windows (\) path separators
 * @param {string} projectPath - Full path to the project file
 * @param {number} folderDepth - Number of folders to go up (0 = project folder, 1 = parent, etc.)
 * @returns {string} Parent folder name or null
 */
function SequenceRenamer_extractParentFolderName(projectPath, folderDepth) {
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

        // Remove the filename (project.prproj)
        cleanParts.pop();

        // Calculate the index based on folderDepth
        // folderDepth 0 = last folder (where .prproj is)
        // folderDepth 1 = parent folder
        // folderDepth 2 = grandparent folder
        var targetIndex = cleanParts.length - 1 - folderDepth;

        if (targetIndex >= 0 && targetIndex < cleanParts.length) {
            return cleanParts[targetIndex];
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
function SequenceRenamer_findSequenceByName(sequenceName) {
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
function SequenceRenamer_listAllSequences() {
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
