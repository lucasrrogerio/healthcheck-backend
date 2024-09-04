import { Router } from "express";
import { logController } from "../../controller/log"

const router: Router = Router();

router.get('/health', logController.getHealth);

export { router };