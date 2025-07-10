import { Sequelize } from "sequelize";

export class PostgresConnector {
    private static instance: Sequelize;

    private constructor() {}

    public static getInstance(): Sequelize {
        if (!PostgresConnector.instance) {
            PostgresConnector.instance = new Sequelize(
                process.env.POSTGRES_DB || "postgres",
                process.env.POSTGRES_USER || "admin",
                process.env.POSTGRES_PASSWORD || "password",
                {
                    host: process.env.POSTGRES_HOST || "localhost",
                    port: Number(process.env.POSTGRES_PORT || "5432"),
                    dialect: "postgres",
                    logging: false,
                }
            );
        }
        return PostgresConnector.instance;
    }
}