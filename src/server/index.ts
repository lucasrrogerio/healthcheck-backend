import express, { Express } from "express";
import cors from "cors";

import { router as logRouter } from "../route/applicationStatus"

const server: Express = express();
server.use(cors());
server.use(logRouter);

export { server };
