import { Transaction } from "sequelize";
import { DatabaseConnector } from "../orm/DatabaseConnector";

type TransactionCallback = (transaction: Transaction) => Promise<void>;

export async function withTransaction(transactionCallback: TransactionCallback) {
    // First, we start a transaction from your connection and save it into a variable
    const transaction: Transaction = await DatabaseConnector.getInstance().transaction();

    try {
        // Then, we do some calls passing this transaction as an option:

        await transactionCallback(transaction);
        
        // If the execution reaches this line, no errors were thrown.
        // We commit the transaction.
        await transaction.commit();
    } catch (error) {
        // If the execution reaches this line, an error was thrown.
        // We rollback the transaction.
        await transaction.rollback();

        throw error;
    }
}
