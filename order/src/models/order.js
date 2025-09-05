import mongoose from "mongoose";

const OrderEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      
      "PENDING", 
      "PACKING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      
    ],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OrderProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  // Added color details
  color: {
    colorId: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
    name: { type: String },
    hexCode: { type: String }
  }
});

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [OrderProductSchema],
    netAmount: { type: Number, required: true },
    subtotalAmount: { type: Number },
    discountPercentage: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: {
      type: String,
      enum: [
        
        "PENDING",
        "PACKING", 
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        
      ],
      default: "PENDING",
    },
    paymentId: { type: String },
    events: [OrderEventSchema],
  },
  { timestamps: true, collection: "orders" }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;