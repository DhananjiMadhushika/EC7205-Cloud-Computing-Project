import Cart from "../models/cart.js";
import jwt from "jsonwebtoken";
import axios from "axios";

const getUserFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const { productId, quantity = 1, color } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Validate product exists by calling product service
    try {
      await axios.get(`http://product:3001/products/${productId}`);
    } catch (error) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: user.userId });
    
    if (!cart) {
      cart = new Cart({ userId: user.userId, items: [] });
    }

    // Check if item with same product and color already exists
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId && 
      item.color?.colorId?.toString() === color?.colorId
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        color: color ? {
          colorId: color.colorId || color._id,
          name: color.name,
          hexCode: color.hexCode
        } : null
      });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get cart items
export const getCartItems = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    const cart = await Cart.findOne({ userId: user.userId });
    
    if (!cart) {
      return res.status(200).json([]);
    }

    // Get product details for each cart item
    const cartItemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const productResponse = await axios.get(`http://product:3001/products/${item.productId}`);
          return {
            id: item._id,
            product: productResponse.data,
            quantity: item.quantity,
            color: item.color,
            addedAt: item.addedAt
          };
        } catch (error) {
          console.error(`Error fetching product ${item.productId}:`, error);
          return null;
        }
      })
    );

    // Filter out null values (products that couldn't be fetched)
    const validCartItems = cartItemsWithDetails.filter(item => item !== null);
    
    res.status(200).json(validCartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const { itemId } = req.params;
    const { quantity, color } = req.body;

    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity) {
      cart.items[itemIndex].quantity = quantity;
    }
    
    if (color) {
      cart.items[itemIndex].color = {
        colorId: color.colorId || color._id,
        name: color.name,
        hexCode: color.hexCode
      };
    }

    await cart.save();
    res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    await Cart.findOneAndUpdate(
      { userId: user.userId },
      { items: [] },
      { new: true }
    );

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};