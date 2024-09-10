import { Router } from "express";
import { applicationStatusController } from "../../controller/applicationStatus"

const router: Router = Router();

router.get('/', applicationStatusController.getAllAppStatusRecent);

export { router };