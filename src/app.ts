import express from "express";
import userRoutes from "./routes/userRoutes";
import { ErrorFactory } from "./utils/factories/errorFactory"
import { ErrorType, SuccessType } from "./utils/enums";
import { User } from "./models/User";
import dotenv from 'dotenv';
import { withDatabaseConnected } from "./utils/connector/connect";
import { Sequelize } from "sequelize";
import { SuccessResponseFactory } from "./utils/factories/successFactory";
import { errorHandlers } from "./middleware/errorHandlers";
import { asyncHandler } from "./utils/asyncHandler";

const result = dotenv.config();

if (result.error) {
  console.warn('.env file not found or failed to load');
}

const app = express();

// Use values from .env with fallbacks
const APP_HOST = process.env.APP_HOST || 'localhost';
const APP_PORT = process.env.APP_PORT || 8080;



withDatabaseConnected((sequelize: Sequelize) => {
  app.use(express.json());
  //app.use("/api", userRoutes);

  app.locals.db = sequelize;

  app.get('/', asyncHandler(async (req: any, res: any) => {
      //const userList = await User.findAll();
      SuccessResponseFactory.getResponse(SuccessType.ServiceOnline).send(res);
   
  }));

  // Use logging handlers
  app.use(...errorHandlers)

  // Use error handlers
  app.use(...errorHandlers)

  app.listen(APP_PORT, () => {
    console.log(`App listening at http://${APP_HOST}:${APP_PORT}`);
  });
});

