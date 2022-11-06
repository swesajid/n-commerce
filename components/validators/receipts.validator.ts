/** @format */

import * as Yup from "yup";

export interface iReceipt {
  v_number: string;
  date: string;
  check: boolean;
  categorie: string;
}

export const initialReceipt: iReceipt = {
  v_number: "",
  date: "",
  check: false,
  categorie: "",
};

export const createReceiptSchema = Yup.object().shape({
  v_name: Yup.string()
    .min(6, "Minimum 6 characters are required")
    .required("Required!"),
  date: Yup.string().optional(),
  check: Yup.boolean().optional(),
  categorie: Yup.string().optional(),
});

export const updateReceiptSchema = Yup.object().shape({
  v_name: Yup.string()
    .min(6, "Minimum 6 characters are required")
    .required("Required!"),
  date: Yup.string().optional(),
  check: Yup.boolean().optional(),
  categorie: Yup.string().optional(),
});

const receiptsValidator = {
  initialReceipt,
  createReceiptSchema,
  updateReceiptSchema,
};
export default receiptsValidator;
