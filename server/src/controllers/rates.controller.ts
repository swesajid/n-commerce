/** @format */

import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import logger from "../config/logger";
import { iApiUser } from "../interfaces/auth.interface";
import Rate from "../models/Rate.model";
import { formatError } from "../utils/error.util";

const NAMESPACE = "Rates Controller";

// Create rate
export const createRate = async (req: Request, res: Response) => {
  try {
    const { first_rate, all_rate, allday_rate, categorie } = req.body;
    const user: iApiUser = req.body.api_user;

    const newRate = new Rate({
      first_rate,
      all_rate,
      allday_rate,
      categorie,
    });
    // newRate.user = user._id;
    await newRate.save();

    res.json({ success: true });
  } catch (err: any) {
    logger.error(NAMESPACE, "Create rate error", err);
    res.status(500).json(formatError("Server error"));
  }
};

// Update Rate
export const updateRate = async (req: Request, res: Response) => {
  const { rateId, name, first_rate, all_rate, allday_rate, categorie } =
    req.body;
  const user: iApiUser = req.body.api_user;

  try {
    const rateFound = await Rate.findById(rateId);

    if (!rateFound) {
      return res.status(404).json(formatError("Rate not found"));
    }

    const to_update: any = {
      first_rate,
      all_rate,
      allday_rate,
      categorie,
    };

    // if (req.files) {

    //     // Get Featured Image
    // 	if (req.files.featured_image) {
    // 		const featured_image: any = req.files.featured_image;
    // 		const featureImageExtName = featured_image.name.split(".")[
    // 			featured_image.name.split(".").length - 1
    // 		];
    // 		if (!ALLOWED_IMAGE_EXTENSIONS.test(featureImageExtName)) {
    // 			return res
    // 				.status(400)
    // 				.json(
    // 					formatError(
    // 						"Only Image files are acceptable"
    // 					)
    // 				);
    // 		}
    // 		const featuredImageUrl = await uploadFileToCDN(featured_image, featured_image.name);
    // 		to_update.featured_image = featuredImageUrl;

    // 	}
    // }

    await Rate.findByIdAndUpdate(rateId, to_update);

    res.json({ success: true });
  } catch (err: any) {
    logger.error(NAMESPACE, "Update rate error", err);
    res.status(500).json(formatError("Server error"));
  }
};

// View Single Rates
export const singleRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rateFound = await Rate.findById(id);

    if (!rateFound) {
      return res.status(404).json(formatError("No rate found"));
    }

    res.json(rateFound);
  } catch (err: any) {
    logger.error(NAMESPACE, "View single rate error", err);
    res.status(500).json(formatError("Server error"));
  }
};

// Delete Single Rates
export const deleteRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rateFound = await Rate.findById(id);

    if (!rateFound) {
      return res.status(404).json(formatError("No rates found"));
    }

    await Rate.findByIdAndDelete(id);

    res.json({ msg: "success" });
  } catch (err: any) {
    logger.error(NAMESPACE, "Delete single rate error", err);
    res.status(500).json(formatError("Server error"));
  }
};

// Get All Rates
export const getAllRates = async (req: Request, res: Response) => {
  try {
    const published = req.query.published;

    if (published === "true") {
      const today = new Date().toISOString();
      const rates = await Rate.find({ publish: true }).sort({ date: "asc" });
      return res.json(rates);
    } else {
      const rates = await Rate.find({}).sort({ date: "asc" });
      return res.json(rates);
    }
  } catch (err: any) {
    logger.error(NAMESPACE, "View all rates error", err);
    res.status(500).json(formatError("Server error"));
  }
};
