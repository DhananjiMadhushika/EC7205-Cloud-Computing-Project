import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    hexCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Color", colorSchema);
