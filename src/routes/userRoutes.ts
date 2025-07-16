import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { AsyncRouter } from "../utils/AsyncRouter";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { checkSlotPayloadHandler, requestStatusAndCreationPayloadHandler, requestStatusAndPeriodPayloadHandler, slotRequestPayloadHandler, uuidParameterHandler } from "../middleware/validationHandlers";
import { UserRepository } from "../repositories/UserRepository";
import logger from "../utils/logger";

// === Create objects ===

// Instantiate Router
const router = new AsyncRouter();

// Create repositories
const userRepository = new UserRepository();
const calendarRepository = new CalendarRepository();
const slotRequestRepository = new SlotRequestRepository();

// Create the service object using repositories
const userService = new UserService(userRepository, calendarRepository, slotRequestRepository);

// Create the controller object using the service
const userController = new UserController(userService);

// === Define routes ===

// --- Request ---

// Create a new slot request
router.postAsync("/request", slotRequestPayloadHandler, userController.createSlotRequest);

// Get all requests for the current user, filtered by status and creation date
router.getAsync("/requests-status", requestStatusAndCreationPayloadHandler, userController.getRequestsByStatusAndCreation);

// Delete a slot request by its UUID
router.deleteAsync("/request/:id", uuidParameterHandler, userController.deleteSlotRequest);

// Get all requests for the current user, filtered by status and period
router.getAsync("/requests", requestStatusAndPeriodPayloadHandler, userController.getRequestsByStatusAndPeriod);

// --- Calendar Slot ---

// Check availability of a slot on a calendar
router.getAsync("/calendar-slot", checkSlotPayloadHandler, userController.checkCalendarSlot);


// Export router as userRoutes (used is app.ts)
export default router;

logger.info("User routes successfully defined")