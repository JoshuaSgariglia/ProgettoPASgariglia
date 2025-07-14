import { Transaction } from "sequelize";
import { DatabaseConnector } from "./DatabaseConnector";

type TransactionCallback = (transaction: Transaction) => Promise<any>;

export async function withTransaction(transactionCallback: TransactionCallback) {
    // Get a transaction from the conenctor and save it into a variable
    const transaction: Transaction = await DatabaseConnector.getInstance().transaction();

    try {
        // Then, pass this transaction as argument to transactionCallback
        const result: any = await transactionCallback(transaction);
        
        // If the execution reaches this line, no errors were thrown
        // Commit the transaction
        await transaction.commit();

        // Finally, return the result of the callback
        return result;
    } catch (error) {
        // If the execution reaches this line, an error was thrown
        // Rollback the transaction
        await transaction.rollback();

        throw error;
    }
}
