/** @format */

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import logger from "../config/logger";
import { iApiUser } from "../interfaces/auth.interface";
import { USER_ROLE } from "../types";
import { formatError } from "../utils/error.util";

const NAMESPACE = "Access-Control Middleware";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = <string>req.headers["skon-auth-token"];
    if (!token) {
      return res.status(401).send(formatError("Access denied"));
    }
    const token_verified = await jwt.verify(
      token,
      process.env.API_SECRET as string
    );
    if (token_verified) {
      const decoded = await jwt.decode(token);
      req.body.api_user = decoded;

      next();
    } else {
      return res.status(401).send(formatError("Access denied"));
    }
  } catch (err: any) {
    logger.error(NAMESPACE, "Token Error", err);
    return res.status(401).send(formatError("Access denied"));
  }
};

export const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: iApiUser = req.body.api_user;
    const role: USER_ROLE = user.role;
    if (role !== "admin") {
      return res.status(401).send(formatError("Access denied"));
    }
    next();
  } catch (err: any) {
    logger.error(NAMESPACE, "Admin middleware error", err);
    return res.status(401).send(formatError("Access denied"));
  }
};

export const clubOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: iApiUser = req.body.api_user;
    const role: USER_ROLE = user.role;
    if (role !== "member") {
      return res.status(401).send(formatError("Access denied"));
    }
    next();
  } catch (err: any) {
    logger.error(NAMESPACE, "Admin middleware error", err);
    return res.status(401).send(formatError("Access denied"));
  }
};
