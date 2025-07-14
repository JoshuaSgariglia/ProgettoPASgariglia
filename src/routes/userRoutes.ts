import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { AsyncRouter } from "../utils/AsyncRouter";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { slotRequestPayloadHandler } from "../middleware/validationHandlers";
import { UserRepository } from "../repositories/UserRepository";

// Instantiate Router
const router = new AsyncRouter();

// Instantiate architecture objects
const userRepository = new UserRepository()
const calendarRepository = new CalendarRepository()
const slotRequestRepository = new SlotRequestRepository();
const userService = new UserService(userRepository, calendarRepository, slotRequestRepository);
const userController = new UserController(userService);

// Define routes
router.postAsync("/request", slotRequestPayloadHandler, userController.createSlotRequest);


// Export router as userRoutes
export default router;
