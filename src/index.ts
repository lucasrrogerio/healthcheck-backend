import express, { Express } from "express";
import cors from "cors";

import { router as logRouter } from "./route/applicationStatus"

const app: Express = express();
app.use(cors());
app.use(logRouter);

export { app };
