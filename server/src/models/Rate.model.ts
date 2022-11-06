/** @format */

import { Document, model, Schema } from "mongoose";

interface RateDocument extends Document {
  user: Schema.Types.ObjectId | string;
  //   name: string;
  first_rate: string;
  all_rate: string;
  allday_rate: string;
  categorie: string;
}

const RateSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    // name: {
    //   type: String,
    //   required: false,
    // },
    first_rate: {
      type: String,
      required: false,
    },
    all_rate: {
      type: String,
      required: false,
    },
    allday_rate: {
      type: String,
      required: false,
    },
    categorie: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Rate = model<RateDocument>("rates", RateSchema);

export default Rate;
