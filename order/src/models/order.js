import mongoose from "mongoose";

const OrderEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "PENDING",
      "PACKING", 
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED"
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

// Add customer details schema
const CustomerDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true }
}, { _id: false }); // _id: false to prevent MongoDB from creating an _id for this subdocument

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Add customer details - stored at time of order creation
    customerDetails: { type: CustomerDetailsSchema, required: true },
    
    products: [OrderProductSchema],
    netAmount: { type: Number, required: true },
    subtotalAmount: { type: Number },
    discountPercentage: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Keep this for backward compatibility or remove if not needed
    status: {
      type: String,
      enum: [
        "PENDING",
        "PACKING", 
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
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