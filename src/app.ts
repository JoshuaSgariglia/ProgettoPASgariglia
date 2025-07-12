import express, { Router } from "express";
import userRoutes from "./routes/userRoutes";
import { UserRole } from "./utils/enums";
import { withDatabaseConnected } from "./utils/connector/connect";
import { Sequelize } from "sequelize";
import { errorHandlers } from "./middleware/errorHandlers";
import publicRoutes from "./routes/publicRoutes";
import adminRoutes from "./routes/adminRoutes";
import { APP_HOST, APP_PORT } from "./utils/config";
import { getAuthHandlers } from "./middleware/authHandlers";
import { logginghandlers } from "./middleware/loggingHandlers";

// Initialize Express app
const app = express();

// Ensures that the database is connected before proceeding
withDatabaseConnected((sequelize: Sequelize) => {
  app.locals.sequelize = sequelize;
  
  // Automatically parses incoming requests with a Content-Type of application/json
  app.use(express.json());

  // Use logging handlers
  app.use(...logginghandlers)

  // Main router - to group routes and to add a prefix
  const router = Router();

  // Public routes (no auth)
  router.use("/", publicRoutes.router);

  // Protected user routes
  router.use("/user", ...getAuthHandlers(UserRole.User), userRoutes.router);

  // Protected admin routes
  router.use("/admin", ...getAuthHandlers(UserRole.Admin), adminRoutes.router);

  // All routes are prefixed with "/api"
  app.use("/api", router); 

  // Use error handlers
  app.use(...errorHandlers)

  // Start listening on port APP_PORT
  app.listen(APP_PORT, () => {
    console.log(`App listening at http://${APP_HOST}:${APP_PORT}`);
  });
});

