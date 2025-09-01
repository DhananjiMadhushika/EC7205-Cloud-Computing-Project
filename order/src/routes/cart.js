import { Router } from "express";
import { 
  addToCart, 
  getCartItems, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from "../controllers/cartController.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const cartRoutes = Router();

cartRoutes.post("/", isAuthenticated, addToCart);
cartRoutes.get("/", isAuthenticated, getCartItems);
cartRoutes.put("/:itemId", isAuthenticated, updateCartItem);
cartRoutes.delete("/:itemId", isAuthenticated, removeFromCart);
cartRoutes.delete("/clear", isAuthenticated, clearCart);

export default cartRoutes;