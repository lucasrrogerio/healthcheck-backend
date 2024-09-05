import { Router } from "express";
import { applicationStatusController } from "../../controller/applicationStatus"

const router: Router = Router();

router.get('/health', applicationStatusController.getAllRecent);
router.get('/logs', applicationStatusController.getAll);
router.get('/logs/count', applicationStatusController.getAllCount);
router.get('/logs/:service', applicationStatusController.get);
router.get('/logs/:service/count', applicationStatusController.getCount);

export { router };