/** @format */

import { Schema, Document, model } from "mongoose";

interface RoleDocument extends Document {
  name: string;
  description: string;
}

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

const Role = model<RoleDocument>("roles", RoleSchema);
export default Role;
