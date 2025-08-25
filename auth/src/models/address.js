import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    lineOne: { type: String, required: true },
    lineTwo: { type: String },
    city: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Address", AddressSchema);
