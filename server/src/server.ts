/** @format */

import express, { NextFunction, Request, Response } from "express";
import next from "next";
import path from "path";
import { config as dotenv } from "dotenv";
import { connectDB } from "./config/db.config";
import logger from "./config/logger";
import fileUpload from "express-fileupload";
import fs from "fs/promises";
import cors from "cors";

const NAMESPACE = "Server";

dotenv();

const dev = process.env.NODE_ENV !== "production";

const PORT = process.env.PORT;

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Routers
import authRouter from "./routers/auth.router";
import userRouter from "./routers/users.router";

nextApp
  .prepare()
  .then(async () => {
    const app = express();

    connectDB();

    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);

    app.get("*", (req: Request, res: Response) => handle(req, res));

    app.listen(PORT, () =>
      logger.info(NAMESPACE, `Server running in port --> ${PORT}`)
    );
  })
  .catch((reason) => console.log(reason));
