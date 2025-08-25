import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    productImage: { type: String },
    description: { type: String, required: true },
    volume: { type: Number },
    price: { type: Number, required: true },
    stock: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    colors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
    finish: { type: String },
    coverage: { type: String },
    dryingTime: { type: String },
    coats: { type: Number, default: 2 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
