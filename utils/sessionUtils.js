const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Generates a unique session ID using crypto
 * @returns {string} A unique session ID
 */
const generateSessionId = () => {
    return crypto.randomBytes(16).toString('hex');
};

/**
 * Stores session data in JSON format in a logs directory
 * @param {string} sessionId - The unique session ID
 * @param {Object} message - The message to store
 * @param {string} [logDir='logs'] - Optional directory name for logs
 */
const storeSessionData = (sessionId, message, logDir = 'logs') => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        sessionId,
        message
    };

    const logFilePath = path.join(__dirname, '..', logDir);
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logFilePath)) {
        fs.mkdirSync(logFilePath, { recursive: true });
    }

    const logFileName = path.join(logFilePath, `${sessionId}.json`);
    fs.appendFileSync(logFileName, JSON.stringify(logEntry, null, 2) + '\n');
};

/**
 * Retrieves session data from the logs
 * @param {string} sessionId - The session ID to retrieve
 * @param {string} [logDir='logs'] - Optional directory name for logs
 * @returns {Array} Array of log entries for the session
 */
const getSessionData = (sessionId, logDir = 'logs') => {
    const logFilePath = path.join(__dirname, '..', logDir, `${sessionId}.json`);
    
    if (!fs.existsSync(logFilePath)) {
        return [];
    }

    const fileContent = fs.readFileSync(logFilePath, 'utf8');
    return fileContent.split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
};

/**
 * Cleans up old session data
 * @param {number} maxAgeHours - Maximum age of logs in hours
 * @param {string} [logDir='logs'] - Optional directory name for logs
 */
const cleanupOldSessions = (maxAgeHours = 24, logDir = 'logs') => {
    const logFilePath = path.join(__dirname, '..', logDir);
    const now = new Date();
    
    if (!fs.existsSync(logFilePath)) {
        return;
    }

    const files = fs.readdirSync(logFilePath);
    files.forEach(file => {
        const filePath = path.join(logFilePath, file);
        const stats = fs.statSync(filePath);
        const fileAgeHours = (now - stats.mtime) / (1000 * 60 * 60);

        if (fileAgeHours > maxAgeHours) {
            fs.unlinkSync(filePath);
        }
    });
};

module.exports = {
    generateSessionId,
    storeSessionData,
    getSessionData,
    cleanupOldSessions
}; 