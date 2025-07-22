import express, { Router } from "express";
import logger from "./utils/logger";
import { APP_HOST, APP_PORT } from "./utils/config";
import { Sequelize } from "sequelize";
import { withDatabaseConnected } from "./utils/connector/connect";
import { adminAuthHandlers, userAuthHandlers } from "./middleware/authHandlers";
import { loggingHandlers } from "./middleware/loggingHandlers";
import { errorHandlers } from "./middleware/errorHandlers";
import publicRoutes from "./routes/publicRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";

/**
 * This is the entry point on the application.
*/

logger.info('Starting Express application...');

// Initialize Express app
const app = express();

// Ensures that the database is connected before proceeding
withDatabaseConnected((sequelize: Sequelize) => {
  app.locals.sequelize = sequelize;

  // Automatically parses incoming requests with a Content-Type of application/json
  app.use(express.json());

  // Use logging handlers
  app.use(...loggingHandlers)

  // Main router - to group routes and to add a prefix
  const router = Router();

  // Public routes (no auth)
  router.use("/", publicRoutes.router);

  // Protected user routes
  router.use("/user", ...userAuthHandlers, userRoutes.router);

  // Protected admin routes
  router.use("/admin", ...adminAuthHandlers, adminRoutes.router);

  // All routes are prefixed with "/api"
  app.use("/api", router);

  // Use error handlers
  app.use(...errorHandlers)

  logger.info('Express application initialization completed');

  // Start listening on port APP_PORT
  app.listen(APP_PORT, () => {
    logger.info(`App listening at http://${APP_HOST}:${APP_PORT}`);
  });
});


