/** @format */

import { Request, Response } from "express";
import logger from "../config/logger";
import { iApiUser } from "../interfaces/auth.interface";
import Event from "../models/Receipt.model";
import { formatError } from "../utils/error.util";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";
import { genSlug } from "../utils/misc.util";
import { uploadFileToCDN } from "../utils/upload.util";
import { UploadedFile } from "express-fileupload";
import Receipt from "../models/Receipt.model";
const NAMESPACE = "Receipts Controller";

// Create Receipt
export const createReceipt = async (req: Request, res: Response) => {
  try {
    const { categorie, v_number, date, check } = req.body;
    const user: iApiUser = req.body.api_user;

    const newReceipt = new Receipt({ categorie, v_number, date, check });
    newReceipt.date = new Date(date);
    // newReceipt.user = user._id;

    await newReceipt.save();

    res.json({ success: true });
  } catch (err: any) {
    logger.error(NAMESPACE, "Create receipt error", err);
    res.status(500).json(formatError("Server error"));
  }
};

// Update Receipt
export const updateReceipt = async (req: Request, res: Response) => {
  const { receiptId, categorie, v_number, date, check } = req.body;

  try {
    const receiptFound = await Receipt.findById(receiptId);

    if (!receiptFound) {
      return res.status(404).json(formatError("Receipt not found"));
    }

    const to_update: any = {
      categorie,
      v_number,
      date,
      check,
    };
    await Receipt.findByIdAndUpdate(receiptId, to_update);

    res.json({ success: true });
  } catch (err: any) {
    logger.error(NAMESPACE, "Update receipt error", err);
    res.status(500).json(formatError("Server error"));
  }
};

// View Single Receipt
export const singleReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receiptFound = await Receipt.findById(id);

    if (!receiptFound) {
      return res.status(404).json(formatError("No receipts found"));
    }

    res.json(receiptFound);
  } catch (err: any) {
    logger.error(NAMESPACE, "View single event error", err);
    res.status(500).json(formatError("Server error"));
  }
};

// Delete Single Receipt
export const deleteReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receiptFound = await Receipt.findById(id);

    if (!receiptFound) {
      return res.status(404).json(formatError("No receipts found"));
    }

    await Receipt.findByIdAndDelete(id);

    res.json({ msg: "success" });
  } catch (err: any) {
    logger.error(NAMESPACE, "Delete single event error", err);
    res.status(500).json(formatError("Server error"));
  }
};

//Get All Receipt
export const getAllReceipts = async (req: Request, res: Response) => {
  try {
    const published = req.query.published;

    if (published === "true") {
      const today = new Date().toISOString();
      const receipts = await Receipt.find({ publish: true }).sort({
        date: "asc",
      });
      return res.json(receipts);
    } else {
      const receipts = await Event.find({}).sort({ date: "asc" });
      return res.json(receipts);
    }
  } catch (err: any) {
    logger.error(NAMESPACE, "View all events error", err);
    res.status(500).json(formatError("Server error"));
  }
};
