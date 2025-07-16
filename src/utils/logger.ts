import winston from 'winston';           // Logging library
import path from 'path';                // Node.js path utility
import fs from 'fs';                    // Node.js file system module
import { LOGS_PATH } from './config';

// Ensure that the log directory exists. Create it recursively if it doesn't.
if (!fs.existsSync(LOGS_PATH)) {
    fs.mkdirSync(LOGS_PATH, { recursive: true });
}

// Get current date and time in ISO format and split date/time parts
const [datePart, timePart] = new Date().toISOString().split('T');

// Format time to HH-MM-SS (remove milliseconds and replace colons with dashes)
const timeFormatted = timePart.split('.')[0].replace(/:/g, '-');

// Final log file name: log_YYYY-MM-DD_HH-MM-SS.txt
const logFilename = path.join(LOGS_PATH, `log_${datePart}_${timeFormatted}.txt`);

// Define the log message format:
// Example: 2025-07-16_12-43-28 - users.service.ts - INFO - Application started
const logFormat = winston.format.printf(({ timestamp, level, message, label }) => {
    return `${timestamp} - ${label || 'app'} - ${level.toUpperCase()} - ${message}`;
});

// Set up the logger transports (destinations):
// Log to the console and to a file
const transports: winston.transport[] = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilename }),
];

// Create the base Winston logger instance
const baseLogger = winston.createLogger({
    level: 'info', // Log only 'info' and higher levels (warn, error)
    format: winston.format.combine(
        winston.format.timestamp(),      // Automatically add timestamps
        logFormat                        // Apply the custom format above
    ),
    transports, // Attach the defined transports
});

// --- Helper to get the caller file name ---

// Extracts the filename from the stack trace
function getCallerFile(): string {
    const stack = new Error().stack;
    if (!stack) return 'unknown';

    const stackLines = stack.split('\n');
    // Stack line that represents the caller (index 3 may vary by runtime)
    const callerLine = stackLines[3] || '';
    const match = callerLine.match(/at (?:.+ \()?(.+):\d+:\d+\)?/);
    if (!match) return 'unknown';

    return path.basename(match[1]);
}

// --- Logger wrapper with dynamic label ---

// Wrap logger methods to inject the caller file name as label
const logger = {
    info: (msg: string) =>
        baseLogger.info(msg, { label: getCallerFile() }),
    warn: (msg: string) =>
        baseLogger.warn(msg, { label: getCallerFile() }),
    error: (msg: string) =>
        baseLogger.error(msg, { label: getCallerFile() }),
    debug: (msg: string) =>
        baseLogger.debug(msg, { label: getCallerFile() }),
    // Optional: access the raw logger if needed
    raw: baseLogger,
};

// Export the logger for use across the application
export default logger;