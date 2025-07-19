import winston from 'winston';          
import path from 'path';                
import fs from 'fs';       

/**
 * This file includes the logic for a custom logger that allows to log both on console and file
 */

// In Docker if .dockerenv is present
const inDocker = fs.existsSync('/.dockerenv');

// Default logs path
const LOGS_PATH = '/usr/app/logs'

// Ensure that the log directory exists only if in Docker
if (inDocker && !fs.existsSync(LOGS_PATH)) {
    fs.mkdirSync(LOGS_PATH, { recursive: true });
}

// === Timestamp Helpers ===

// Format a Date object into "YYYY-MM-DD HH:mm:ss.ms" using local time
function formatTimestamp(date: Date): string {
    const pad = (n: number, width = 2) => n.toString().padStart(width, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = pad(date.getMilliseconds(), 3);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// Format local timestamp for filename: log_YYYY-MM-DD_HH-MM-SS.txt
function formatLogFilenameTimestamp(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `log_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.txt`;
}

// Determine log filename based on current datetime
const now = new Date();
const logFilename = path.join(LOGS_PATH, formatLogFilenameTimestamp(now));

// Define the log message format:
// Example: 2025-07-16 12:43:28.123 - users.service.ts - INFO - Application started
const logFormat = winston.format.printf(({ timestamp, level, message, label }) => {
    return `${timestamp} - ${label || 'app'} - ${level.toUpperCase()} - ${message}`;
});

// Set up the logger transports:
// Always log to console. Log to file only if running in Docker.
const transports: winston.transport[] = [
    new winston.transports.Console(),
];

if (inDocker) {
    transports.push(
        new winston.transports.File({ filename: logFilename })
    );
}

// Create the base Winston logger instance
const baseLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: () => formatTimestamp(new Date()) }), // Local time, custom format
        logFormat
    ),
    transports,
});

// --- Helper to get the caller file name ---
function getCallerFile(): string {
    const stack = new Error().stack;
    if (!stack) return 'unknown';

    const stackLines = stack.split('\n');
    const callerLine = stackLines[3] || '';
    const match = callerLine.match(/at (?:.+ \()?(.+):\d+:\d+\)?/);
    if (!match) return 'unknown';

    return path.basename(match[1]);
}

// --- Logger wrapper with dynamic label ---
const logger = {
    info: (msg: string) =>
        baseLogger.info(msg, { label: getCallerFile() }),
    warn: (msg: string) =>
        baseLogger.warn(msg, { label: getCallerFile() }),
    error: (msg: string) =>
        baseLogger.error(msg, { label: getCallerFile() }),
    debug: (msg: string) =>
        baseLogger.debug(msg, { label: getCallerFile() }),
    raw: baseLogger,
};

logger.info("Logger initialized successfully")
logger.info(inDocker ? "Logging enabled on console and on file" : "Logging enabled on console only")

export default logger;