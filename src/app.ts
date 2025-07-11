import express from "express";
import userRoutes from "./routes/userRoutes";
import { ErrorFactory } from "./utils/factories/errorFactory"
import { ErrorType, SuccessType } from "./utils/enums";
import { User } from "./models/User";
import dotenv from 'dotenv';
import { withDatabaseConnected } from "./utils/connector/connect";
import { Sequelize } from "sequelize";
import { SuccessResponseFactory } from "./utils/factories/successFactory";

const result = dotenv.config();

if (result.error) {
  console.warn('.env file not found or failed to load');
}

const app = express();

// Use values from .env with fallbacks
const APP_HOST = process.env.APP_HOST || 'localhost';
const APP_PORT = process.env.APP_PORT || 8080;


app.use(express.json());
//app.use("/api", userRoutes);

withDatabaseConnected((sequelize: Sequelize) => {
  app.locals.db = sequelize;

  app.get('/', async (req: any, res: any) => {
    try {
      const userList = await User.findAll();
      ErrorFactory.getError(ErrorType.MissingAuthorization).send(res)
      SuccessResponseFactory.getResponse(SuccessType.ServiceOnline, userList).send(res);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.listen(APP_PORT, () => {
    console.log(`App listening at http://${APP_HOST}:${APP_PORT}`);
  });
});


