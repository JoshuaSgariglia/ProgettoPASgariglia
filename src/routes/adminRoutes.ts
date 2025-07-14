import { UserRepository } from "../repositories/UserRepository";
import { AsyncRouter } from "../utils/AsyncRouter";
import { AdminService } from "../services/AdminService";
import { AdminController } from "../controllers/AdminController";
import { calendarCreationPayloadHandler, calendarUpdatePayloadHandler, userPayloadHandler } from "../middleware/validationHandlers";
import { ComputingResourceRepository } from "../repositories/ComputingResourceRepository";
import { CalendarRepository } from "../repositories/CalendarRepository";

// Instantiate Router
const router = new AsyncRouter();

// Instantiate architecture objects
const userRepository = new UserRepository();
const calendarRepository = new CalendarRepository();
const computingResourceRepository = new ComputingResourceRepository();
const adminService = new AdminService(userRepository, calendarRepository, computingResourceRepository);
const adminController = new AdminController(adminService);

// --- Define routes ---

// Register user
router.postAsync("/user", userPayloadHandler, adminController.createUser.bind(adminController));

// Calendar CRUD
router.postAsync("/calendar", calendarCreationPayloadHandler, adminController.createCalendar.bind(adminController));
router.putAsync("/calendar/:id", calendarUpdatePayloadHandler, adminController.updateCalendar.bind(adminController));
router.getAsync("/calendar/:id", adminController.getCalendar.bind(adminController));
router.deleteAsync("/calendar/:id", adminController.deleteCalendar.bind(adminController));
router.patchAsync("/archive-calendar/:id", adminController.archiveCalendar.bind(adminController));


// Export router as userRoutes
export default router;