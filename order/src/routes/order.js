import { Router } from "express";
import { 
  createOrderFromCart, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus,
  cancelOrder,
  getAllOrders
 
} from "../controllers/orderController.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const orderRoutes = Router();

// All routes use HTTP communication
orderRoutes.post("/create", isAuthenticated, createOrderFromCart);
orderRoutes.get("/all",isAuthenticated, getAllOrders);
orderRoutes.get("/", isAuthenticated, getUserOrders);
orderRoutes.get("/:orderId", isAuthenticated, getOrderById);
orderRoutes.put("/:orderId/status", updateOrderStatus);
orderRoutes.put("/:orderId/cancel", isAuthenticated, cancelOrder);
orderRoutes.get("/all",isAuthenticated, getAllOrders);


export default orderRoutes;