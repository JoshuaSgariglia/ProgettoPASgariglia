import { UserRepository } from "../repositories/UserRepository";
import { AsyncRouter } from "../utils/AsyncRouter";
import { AdminService } from "../services/AdminService";
import { AdminController } from "../controllers/AdminController";
import { userPayloadHandler } from "../middleware/validationHandlers";

// Instantiate Router
const router = new AsyncRouter();

// Instantiate architecture objects
const userRepository = new UserRepository();
const adminService = new AdminService(userRepository);
const adminController = new AdminController(adminService);

// --- Define routes ---

// Register user
router.postAsync("/user", userPayloadHandler, adminController.createUser.bind(adminController));


// Export router as userRoutes
export default router;