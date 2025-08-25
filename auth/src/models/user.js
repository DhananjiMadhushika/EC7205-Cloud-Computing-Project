import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, default: "" }, // Google users may not have password
    phoneNumber: { type: String, default: "" },
    userImage: { type: String },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    defaultShippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    defaultBillingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    passwordResetToken: { type: String, unique: false },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
