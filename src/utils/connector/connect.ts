import { Sequelize } from "sequelize";
import { DatabaseConnector } from "./DatabaseConnector";
import { RETRY_COUNT, RETRY_DELAY } from "../config";

interface RetryOptions {
    retryCount: number;
    retryDelay: number;
}

type ConnectionFunction = (sequelize: Sequelize) => Promise<Sequelize>;
type ConnectionCallback = (sequelize: Sequelize) => void;

/**
 * Base connect function: just authenticate
 */
const connect: ConnectionFunction = async (sequelize) => {
    await sequelize.authenticate();
    return sequelize;
};

/**
 * Retry decorator returns an async function expecting sequelize
 */
const withRetry = (
    connect: ConnectionFunction,
    retryOptions: RetryOptions = { retryCount: RETRY_COUNT, retryDelay: RETRY_DELAY }
) => {
    return async (sequelize: Sequelize) => {
        let connected = false;

        for (let attempt = 1; attempt <= retryOptions.retryCount; attempt++) {
            try {
                console.log(`Attempting to connect to database (Attempt ${attempt})...`);
                await connect(sequelize);
                connected = true;
                break;
            } catch (error) {
                console.error(`Connection attempt ${attempt} failed:`, (error as Error).message);

                if (attempt < retryOptions.retryCount) {
                    const delay = retryOptions.retryDelay * 2 ** (attempt - 1);
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        if (!connected) {
            console.error('All retry attempts failed. Exiting.');
            process.exit(1);
        } else {
            return sequelize;
        }
    };
};

/**
 * Logs around connection attempt
 */
const withConnectionLogged = (connect: ConnectionFunction) => {
    return async (sequelize: Sequelize) => {
        console.log('Attempting database connection');
        await connect(sequelize);
        console.log('Successfully connected to database');
        return sequelize;
    };
};


export const withDatabaseConnected = (callback: ConnectionCallback) => 
    withConnectionLogged(withRetry(connect))(DatabaseConnector.getInstance())
        .then((sequelize) => callback(sequelize))
