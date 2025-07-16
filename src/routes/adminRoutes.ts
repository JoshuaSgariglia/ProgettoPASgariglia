import { UserRepository } from "../repositories/UserRepository";
import { AsyncRouter } from "../utils/AsyncRouter";
import { AdminService } from "../services/AdminService";
import { AdminController } from "../controllers/AdminController";
import { calendarCreationPayloadHandler, calendarUpdatePayloadHandler, requestApprovalPayloadHandler, userPayloadHandler, uuidParameterHandler } from "../middleware/validationHandlers";
import { ComputingResourceRepository } from "../repositories/ComputingResourceRepository";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";

// Instantiate Router
const router = new AsyncRouter();

// Instantiate architecture objects
const userRepository = new UserRepository();
const calendarRepository = new CalendarRepository();
const slotRequestRepository = new SlotRequestRepository();
const computingResourceRepository = new ComputingResourceRepository();
const adminService = new AdminService(userRepository, calendarRepository, slotRequestRepository, computingResourceRepository);
const adminController = new AdminController(adminService);

// --- Define routes ---

// Register user
router.postAsync("/user", userPayloadHandler, adminController.createUser);

// Calendar CRUD
router.postAsync("/calendar", calendarCreationPayloadHandler, adminController.createCalendar);
router.putAsync("/calendar/:id", uuidParameterHandler, calendarUpdatePayloadHandler, adminController.updateCalendar);
router.getAsync("/calendar/:id", uuidParameterHandler, adminController.getCalendar);
router.deleteAsync("/calendar/:id", uuidParameterHandler, adminController.deleteCalendar);
router.patchAsync("/archive-calendar/:id", uuidParameterHandler, adminController.archiveCalendar);

// Request
router.patchAsync("/request-status/:id", uuidParameterHandler, requestApprovalPayloadHandler, adminController.updateRequestStatus);
router.getAsync("/calendar/:id/requests", uuidParameterHandler, adminController.getRequestsByCalendar);



// Export router as userRoutes
export default router;