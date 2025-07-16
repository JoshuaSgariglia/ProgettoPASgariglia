import { Transaction } from "sequelize";
import { DatabaseConnector } from "./DatabaseConnector";

/*
 * This file provides utility functions to manage database transactions using Sequelize.
*/

// Type of function that receives a Sequelize transaction
type TransactionCallback = (transaction: Transaction) => Promise<any>;

// Returns a new Sequelize transaction from the shared DatabaseConnector
export async function getTransaction(): Promise<Transaction> {
    return await DatabaseConnector.getInstance().transaction();
}

// Wraps the given callback, managing the transaction commit and rollback parts
export async function withTransaction(transactionCallback: TransactionCallback): Promise<any> {
    // Start a new transaction
    const transaction: Transaction = await getTransaction();

    try {
        // Execute the provided callback, passing the transaction
        const result: any = await transactionCallback(transaction);
        
        // If the callback runs successfully, commit the transaction
        await transaction.commit();

        // Return the result from the callback
        return result;
    } catch (error) {
        // If any error occurs, rollback the transaction
        await transaction.rollback();

        // Rethrow the error so it can be handled upstream
        throw error;
    }
}