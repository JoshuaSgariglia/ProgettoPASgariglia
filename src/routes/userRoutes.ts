import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { AsyncRouter } from "../utils/AsyncRouter";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { checkSlotPayloadHandler, requestStatusAndCreationPayloadHandler, slotRequestPayloadHandler, uuidParameterHandler } from "../middleware/validationHandlers";
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

// Request
router.postAsync("/request", slotRequestPayloadHandler, userController.createSlotRequest);
router.getAsync("/requests-status", requestStatusAndCreationPayloadHandler, userController.getRequestsByStatusAndCreationPeriod);
router.deleteAsync("/request/:id", uuidParameterHandler, userController.deleteSlotRequest);

// Calendar slot
router.getAsync("/calendar-slot", checkSlotPayloadHandler, userController.checkCalendarSlot);


// Export router as userRoutes
export default router;
