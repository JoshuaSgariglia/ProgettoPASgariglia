import { UserRepository } from "../repositories/UserRepository";
import { AsyncRouter } from "../utils/AsyncRouter";
import { AdminService } from "../services/AdminService";
import { AdminController } from "../controllers/AdminController";

// Instantiate Router
const router = new AsyncRouter();

// Instantiate architecture objects
const userRepository = new UserRepository();
const adminService = new AdminService(userRepository);
const adminController = new AdminController(adminService);

// Define routes

// Export router as userRoutes
export default router;