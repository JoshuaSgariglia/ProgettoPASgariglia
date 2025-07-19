import { UserRepository } from "../repositories/UserRepository";
import { AsyncRouter } from "../utils/AsyncRouter";
import { AdminService } from "../services/AdminService";
import { AdminController } from "../controllers/AdminController";
import { calendarCreationPayloadHandler, calendarUpdatePayloadHandler, requestApprovalPayloadHandler, userPayloadHandler, userRechargePayloadHandler, uuidParameterHandler } from "../middleware/validationHandlers";
import { ComputingResourceRepository } from "../repositories/ComputingResourceRepository";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";
import logger from "../utils/logger";

// === Create objects ===

// Instantiate Router
const router = new AsyncRouter();

// Create repositories
const userRepository = new UserRepository();
const calendarRepository = new CalendarRepository();
const slotRequestRepository = new SlotRequestRepository();
const computingResourceRepository = new ComputingResourceRepository();

// Create service object using repositories
const adminService = new AdminService(
  userRepository,
  calendarRepository,
  slotRequestRepository,
  computingResourceRepository
);

// Create controller object using the service
const adminController = new AdminController(adminService);


// === Define routes ===

// --- Calendar CRUD ---

// Create a new calendar
router.postAsync("/calendar", calendarCreationPayloadHandler, adminController.createCalendar);

// Update an existing calendar by its UUID
router.putAsync("/calendar/:id", uuidParameterHandler, calendarUpdatePayloadHandler, adminController.updateCalendar);

// Get details of a calendar by its UUID
router.getAsync("/calendar/:id", uuidParameterHandler, adminController.getCalendar);

// Delete a calendar by its UUID
router.deleteAsync("/calendar/:id", uuidParameterHandler, adminController.deleteCalendar);

// Archive a calendar (soft delete) by its UUID
router.patchAsync("/calendar/:id/archive", uuidParameterHandler, adminController.archiveCalendar);

// --- Request ---

// Approve or reject a slot request by its UUID
router.patchAsync("/request-status/:id", uuidParameterHandler, requestApprovalPayloadHandler, adminController.updateRequestStatus);

// Get all requests status by calendar UUID
router.getAsync("/calendar/:id/requests-status", uuidParameterHandler, adminController.getRequestsStatusByCalendar);

// --- User ---

// Register a new user
router.postAsync("/user", userPayloadHandler, adminController.createUser);

// Update user tokens by user UUID
router.patchAsync("/user/:id/tokens", uuidParameterHandler, userRechargePayloadHandler, adminController.updateUserTokens);


// Export router as adminRoutes (used is app.ts)
export default router;

logger.info("Admin routes successfully defined")