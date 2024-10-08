import express, { Express } from "express";
import cors from "cors";

import { router as logRouter } from "./route/applicationStatus"
import { router as healthRouter } from "./route/health"
import { applicationStatusService } from "./service/applicationStatus";

const app: Express = express();

const apiVersion = "/api/v1"

app.use(cors());
app.use(`${apiVersion}/logs`, logRouter);
app.use(`${apiVersion}/health`, healthRouter)

function minutosParaMillis(minutos: number) {
    return minutos * 60000;
}

setInterval(applicationStatusService.getAllAppStatusRecent, minutosParaMillis(10));

export { app };