import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { SuccessResponseFactory } from "../utils/factories/successFactory";
import { SuccessType } from "../utils/enums";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { loginPayloadHandler } from "../middleware/validationHandlers";
import { AsyncRouter } from "../utils/AsyncRouter";

// --- Create objects ---

// Instantiate Router
const router = new AsyncRouter();

// Instantiate repository, service and controller objects
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// --- Define routes ---

// Check if service is online
router.getAsync('/', async (req: Request, res: Response) => {
  SuccessResponseFactory.getResponse(SuccessType.ServiceOnline).sendIn(res);
});

// Login
router.postAsync("/login", loginPayloadHandler, authController.loginUser);


// Export router as publicRoutes (used is app.ts)
export default router;