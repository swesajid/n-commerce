/** @format */

import * as Yup from "yup";
export interface iRate {
  first_rate: string;
  all_rate: string;
  allday_rate: string;
  categorie: string;
}

export const initialRate: iRate = {
  first_rate: "",
  all_rate: "",
  allday_rate: "",
  categorie: "",
};

export const createRateSchema = Yup.object().shape({
  first_rate: Yup.string()
    .min(2, "Minimum 2 characters are required")
    .required("Required!"),
  all_rate: Yup.string().min(2, "Minimum 2 characters are required").optional(),
  allday_rate: Yup.string()
    .min(2, "Minimum 2 characters are required")
    .optional(),
  categorie: Yup.string().optional(),
});

export const updateRateSchema = Yup.object().shape({
  first_rate: Yup.string()
    .min(2, "Minimum 2 characters are required")
    .optional(),
  all_rate: Yup.string().min(2, "Minimum 6 characters are required").optional(),
  allday_rate: Yup.string()
    .min(2, "Minimum 6 characters are required")
    .optional(),
  categorie: Yup.string().optional(),
});

const ratesValidator = { initialRate, createRateSchema, updateRateSchema };
export default ratesValidator;
