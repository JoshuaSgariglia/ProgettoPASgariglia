import { Router, Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { asyncHandler } from "../utils/asyncHandler";
import { SuccessResponseFactory } from "../utils/factories/successFactory";
import { SuccessType } from "../utils/enums";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";

// Instantiate Router
const router = Router();

// Instantiate architecture objects
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Define routes
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    SuccessResponseFactory.getResponse(SuccessType.ServiceOnline).send(res);
  }));

router.post("/login", authController.loginUser);

// Export router as userRoutes
export default router;