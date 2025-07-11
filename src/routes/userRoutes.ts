import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { UserDAO } from "../dao/UserDAO";

const router = Router();

const userDAO = new UserDAO();
const userRepo = new UserRepository(userDAO);
const userService = new UserService(userRepo);
const userController = new UserController(userService);


router.get("/users", userController.list);
router.get("/users-page", userController.listPage);
router.post("/users", userController.create);
router.get("/users/:id", userController.get);
router.delete("/users/:id", userController.delete);


export default router;
