import { Sequelize } from "sequelize";
import { DatabaseConnector } from "./DatabaseConnector";
import { RETRY_COUNT, RETRY_DELAY } from "../config";
import logger from "../logger";

/**
 * This file includes the logic for connecting to the database, with retry.
 * Implements the Decorator design pattern.
*/

// Defines options for retry attempts
interface RetryOptions {
    retryCount: number;
    retryDelay: number;
}

// Type of function that takes a Sequelize instance and returns a Promise of Sequelize
type ConnectionFunction = (sequelize: Sequelize) => Promise<Sequelize>;

// Type of function to be called after connection is successful
type ConnectionCallback = (sequelize: Sequelize) => void;

// Basic connect function that attempts to authenticate the Sequelize instance with the database
const connect: ConnectionFunction = async (sequelize) => {
    await sequelize.authenticate();
    return sequelize;
};

// Higher-order function that wraps a connection function with retry logic.
// It attempts to connect multiple times, with exponentially increasing delay between attempts.
const withRetry = (
    connect: ConnectionFunction,
    retryOptions: RetryOptions = { retryCount: RETRY_COUNT, retryDelay: RETRY_DELAY }
) => {
    return async (sequelize: Sequelize) => {
        let connected = false;

        // Try connecting up to retryCount times
        for (let attempt = 1; attempt <= retryOptions.retryCount; attempt++) {
            try {
                logger.info(`Attempting to connect to database (Attempt ${attempt})...`);

                await connect(sequelize);  // Try the actual connection
                connected = true;          // Mark as connected if successful

                break;

            } catch (error) {
                // Log error message if connection attempt fails
                logger.error(`Connection attempt ${attempt} failed: ${(error as Error).message}`);

                // If this is not the last attempt, wait before retrying
                if (attempt < retryOptions.retryCount) {
                    // Calculate new delay
                    const delay = retryOptions.retryDelay * 2 ** (attempt - 1);

                    logger.info(`Retrying in ${delay}ms...`);

                    // Timeout before new attempt
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        // If all attempts failed, log fatal message and exit process with error code 1...
        if (!connected) {
            logger.error('[FATAL] All retry attempts failed. Exiting with code 1.');
            process.exit(1);

        } else { // ...else return the connected Sequelize instance on success
            return sequelize;  
        }
    };
};

// Decorator that wraps a connection function to add logging before and after connection attempts
const withConnectionLogged = (connect: ConnectionFunction) => {
    return async (sequelize: Sequelize) => {
        logger.info('Attempting database connection');
        await connect(sequelize);  // Call the wrapped connection function
        logger.info('Successfully connected to database');

        return sequelize;          
    };
};

// Function that runs the connection process with retry and logging,
// then calls the provided callback with the connected Sequelize instance
export const withDatabaseConnected = (callback: ConnectionCallback) => 
    withConnectionLogged(withRetry(connect))(DatabaseConnector.getInstance())
        .then((sequelize) => callback(sequelize));

