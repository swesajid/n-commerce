/** @format */

import { Request, Response } from "express";
import User from "../models/User.model";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import logger from "../config/logger";
import { formatError } from "../utils/error.util";
import { iApiUser } from "../interfaces/auth.interface";
//import Profile from '../models/Profile.model';

const NAMESPACE = "Auth Controller";

// Get User Info
export const getUserInfo = async (req: Request, res: Response) => {
  const user: iApiUser = req.body.api_user;
  try {
    const userFound = await User.findById(user._id).select(
      "_id name email username role "
    );
    if (!userFound) {
      return res.status(404).json(formatError("No user found"));
    }
    res.json(userFound);
  } catch (err: any) {
    logger.error(NAMESPACE, "Get user info error", err);
    res.status(500).json(formatError("Internal Server Error"));
  }
};

// Register User
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const username = req.body.username ? req.body.username : email;

  try {
    const userFound = await User.findOne({ email });

    if (userFound) {
      return res.status(400).json(formatError("User exists!"));
    }

    // Hash Password
    const encrypted = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      username,
      password: encrypted,
      role,
    });

    const savedUser = await newUser.save();
    // const newProfile = new Profile(
    // 	{
    // 		user: savedUser._id,
    // 	}
    // );
    // const savedProfile = await newProfile.save();
    const secret = process.env.API_SECRET as string;

    const token = await jwt.sign(
      {
        _id: savedUser._id,
        name,
        email,
        username,
        role: savedUser.role,
      },
      secret
    );

    res.json({ token });
  } catch (err: any) {
    logger.error(NAMESPACE, "Create user error", err);
    res.status(500).json(formatError("Server error"));
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    const userFound = email
      ? await User.findOne({ email })
      : await User.findOne({ username });

    if (!userFound) {
      return res.status(404).json(formatError("Invalid credentials"));
    }

    const passwordMatched = await bcrypt.compare(password, userFound.password);

    if (!passwordMatched) {
      return res.status(401).json(formatError("Invalid credentials"));
    }

    if (userFound.active != "Active") {
      return res.status(404).json(formatError("User is not active"));
    }

    const payload = {
      _id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      name: userFound.name,
      role: userFound.role,
    };
    const secret = process.env.API_SECRET as string;
    const token = await jwt.sign(payload, secret);
    res.json({ token, email: payload.email, name: payload.name });
  } catch (err: any) {
    logger.error(NAMESPACE, "Create User Error", err);
    res.status(500).json(formatError("Server error"));
  }
};

// Forgot Password
export const userForgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userFound = await User.findOne({ email }).select(
      "_id firstname lastname email username role "
    );

    if (!userFound) {
      return res.status(404).json(formatError("User not found"));
    }

    const payload = {
      _id: userFound._id,
      email: userFound.email,
      username: userFound.email,
      name: userFound.name,
      role: userFound.role,
    };
    const secret = process.env.API_SECRET as string;
    const token = await jwt.sign(payload, secret);
    res.json({ token });
  } catch (err: any) {
    logger.error(NAMESPACE, "Forgot Password Error", err);
    res.status(500).json(formatError("Server error"));
  }
};
