import Order from "../models/order.js";
import Cart from "../models/cart.js";
import jwt from "jsonwebtoken";
import axios from "axios";

const getUserFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Create order from cart
export const createOrderFromCart = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    // Get user's cart
    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Get user details from auth service
    const userResponse = await axios.get(`http://auth:3000/users/${user.userId}`, {
      headers: { Authorization: req.headers.authorization }
    });
    const userData = userResponse.data;

    if (!userData.addresses || userData.addresses.length === 0 || !userData.addresses[0].formattedAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (!userData.phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Get product details and calculate total
    const orderProducts = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const productResponse = await axios.get(`http://product:3001/products/${item.productId}`);
          const product = productResponse.data;
          
          return {
            productId: item.productId,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            color: item.color
          };
        } catch (error) {
          throw new Error(`Product ${item.productId} not found`);
        }
      })
    );

    const subtotalAmount = orderProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const netAmount = subtotalAmount; // Add tax, shipping calculations here if needed

    // Create order
    const order = new Order({
      userId: user.userId,
      products: orderProducts,
      netAmount,
      subtotalAmount,
      address: userData.addresses[0].formattedAddress,
      phoneNumber: userData.phoneNumber,
      status: "PENDING"
    });

    await order.save();

    // Clear cart after successful order
    await Cart.findOneAndUpdate(
      { userId: user.userId },
      { items: [] }
    );

    res.status(201).json({
      message: "Order created successfully",
      order: order
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get user orders
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

// Get order by ID
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

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    order.status = status;
    order.events.push({ status });
    await order.save();
    
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};