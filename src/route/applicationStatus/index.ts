import { Router } from "express";
import { applicationStatusController } from "../../controller/applicationStatus"

const router: Router = Router();

router.get('/', applicationStatusController.getAll);
router.get('/count', applicationStatusController.getAllCount);
router.get('/:service', applicationStatusController.get);
router.get('/:service/count', applicationStatusController.getCount);

export { router };