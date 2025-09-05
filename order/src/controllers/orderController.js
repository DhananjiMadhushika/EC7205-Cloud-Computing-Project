import Order from "../models/order.js";
import Cart from "../models/cart.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import MessageBroker from "../utils/messageBroker.js";

const getUserFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Create order from cart
export const createOrderFromCart = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const { selectedItemIds } = req.body; // ✅ expect from frontend

    // Get user's cart
    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!selectedItemIds || selectedItemIds.length === 0) {
      return res.status(400).json({ message: "No items selected for order" });
    }

    // ✅ Filter only selected cart items
    const selectedItems = cart.items.filter((item) =>
      selectedItemIds.includes(item._id.toString())
    );
    if (selectedItems.length === 0) {
      return res.status(400).json({ message: "Selected items not found in cart" });
    }

    // Get user details from auth service
    const userResponse = await axios.get(
      `http://auth:3000/users/${user.userId}`,
      { headers: { Authorization: req.headers.authorization } }
    );
    const userData = userResponse.data;

    if (
      !userData.addresses ||
      userData.addresses.length === 0 ||
      !userData.addresses[0].formattedAddress
    ) {
      return res.status(400).json({ message: "Shipping address is required" });
    }
    if (!userData.phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check product availability and prepare order items
    const orderProducts = [];
    for (const item of selectedItems) {
      try {
        const productResponse = await axios.get(
          `http://product:3001/products/${item.productId}`
        );
        const product = productResponse.data;

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          });
        }

        orderProducts.push({
          productId: item.productId,
          name: product.name,
          image: product.productImage,
          price: product.price,
          quantity: item.quantity,
          color: item.color,
        });
      } catch (error) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found or unavailable` });
      }
    }

    const subtotalAmount = orderProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const netAmount = subtotalAmount; // add tax/shipping if needed

    // Create new order
    const order = new Order({
      userId: user.userId,
      products: orderProducts,
      netAmount,
      subtotalAmount,
      address: userData.addresses[0].formattedAddress,
      phoneNumber: userData.phoneNumber,
      status: "PENDING",
      events: [{ status: "PENDING" }],
    });

    await order.save();

    // ✅ Remove only selected items from cart
    cart.items = cart.items.filter(
      (item) => !selectedItemIds.includes(item._id.toString())
    );
    await cart.save();

    // Send stock update via RabbitMQ
    const stockUpdates = orderProducts.map((p) => ({
      productId: p.productId,
      quantity: p.quantity,
    }));

    await MessageBroker.publishMessage("inventory_updates", {
      type: "REDUCE_STOCK",
      products: stockUpdates,
      orderId: order._id,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get user orders (HTTP only)
export const getUserOrders = async (req, res) => {
  try {
    const user = getUserFromToken(req);

    const orders = await Order.find({ userId: user.userId })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // ❌ no populate
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: error.message });
  }
};



// Get order by ID (HTTP only)
export const getOrderById = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: user.userId 
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status (HTTP only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "PACKING", "OUT_FOR_DELIVERY", "DELIVERED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    order.events.push({ status });
    await order.save();

    res.status(200).json({ 
      message: "Order status updated successfully", 
      order 
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel order (with stock restoration via RabbitMQ)
export const cancelOrder = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: user.userId 
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({ 
        message: "Order can only be cancelled when status is PENDING" 
      });
    }

    // Update order status
    order.status = "CANCELLED";
    order.events.push({ status: "CANCELLED" });
    await order.save();

    // Restore stock via RabbitMQ
    const stockUpdates = order.products.map(p => ({
      productId: p.productId,
      quantity: p.quantity
    }));

    await MessageBroker.publishMessage("inventory_updates", {
      type: "RESTORE_STOCK",
      products: stockUpdates,
      orderId: order._id,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ 
      message: "Order cancelled successfully", 
      order 
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};