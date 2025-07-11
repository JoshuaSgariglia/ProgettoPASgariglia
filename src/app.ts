import express from "express";
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

withDatabaseConnected((sequelize: Sequelize) => {
  app.locals.database = sequelize;

  // Automatically parses incoming requests with a Content-Type of application/json
  app.use(express.json());

  // Use logging handlers
  app.use(...logginghandlers)

  // Public routes (no auth)
  app.use("/api/public", publicRoutes);

  // Protected routes
  app.use("/api/user", ...getAuthHandlers(UserRole.User), userRoutes);
  app.use("/api/admin", ...getAuthHandlers(UserRole.Admin), adminRoutes);

  


  // Use error handlers
  app.use(...errorHandlers)

  app.listen(APP_PORT, () => {
    console.log(`App listening at http://${APP_HOST}:${APP_PORT}`);
  });
});

