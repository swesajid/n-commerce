/** @format */

import { Document, model, Schema } from "mongoose";

interface ReceiptDocument extends Document {
  user: Schema.Types.ObjectId | string;
  categorie: string;
  v_number: string;
  date: Date;
  check?: boolean;
}
const ReceiptSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    categorie: {
      type: String,
      required: false,
    },
    v_number: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: false,
    },
    check: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const Receipt = model<ReceiptDocument>("receipts", ReceiptSchema);

export default Receipt;
