import { Router } from "express";
import { 
  createOrderFromCart, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus 
} from "../controllers/orderController.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const orderRoutes = Router();

orderRoutes.post("/create", isAuthenticated, createOrderFromCart);
orderRoutes.get("/", isAuthenticated, getUserOrders);
orderRoutes.get("/:orderId", isAuthenticated, getOrderById);
orderRoutes.put("/:orderId/status", updateOrderStatus); // Admin only

export default orderRoutes;