import { Router } from "express";
import { applicationStatusController } from "../../controller/applicationStatus"

const router: Router = Router();

router.get('/', applicationStatusController.getAllAppStatus);
router.get('/count', applicationStatusController.getAllAppStatusCount);
router.get('/export', applicationStatusController.exportAllLogs);
router.get('/:application', applicationStatusController.getAppStatusFromApp);
router.get('/:application/count', applicationStatusController.getAppStatusFromAppCount);
router.get('/:application/export', applicationStatusController.exportAllLogsFromApp);

export { router };