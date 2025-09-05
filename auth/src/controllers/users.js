import User from "../models/user.js";
import Address from "../models/address.js";

// Add Address
// Add Address
export const addAddress = async (req, res) => {
  try {
    // Create the address
    const address = await Address.create({ 
      ...req.body, 
      user: req.user.userId 
    });
    
    // Add the address ID to the user's addresses array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { addresses: address._id } },
      { new: true }
    );
    
    res.json(address);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({
      error: "Failed to create address",
      message: error.message
    });
  }
};

// List Addresses
export const listAddress = async (req, res) => {
  const addresses = await Address.find({ user: req.user.userId });
  res.json(addresses);
};

// Delete Address
// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    
    // Delete the address
    await Address.findByIdAndDelete(addressId);
    
    // Remove the address ID from the user's addresses array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { addresses: addressId } },
      { new: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      error: "Failed to delete address",
      message: error.message
    });
  }
};

// Update User
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true });
  res.json(user);
};

// Change Role
export const changeUserRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.json(user);
};

// List Normal Users
export const listNormalUsers = async (req, res) => {
  const users = await User.find({ role: "USER" }).populate("addresses").limit(10);
  res.json(users);
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    console.log("getUserById called with ID:", req.params.id);
    
    const user = await User.findById(req.params.id).populate("addresses");
    
    if (!user) {
      console.log("User not found for ID:", req.params.id);
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log("User found:", user);
    res.json(user);
    
  } catch (error) {
    console.error("Error in getUserById:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: "Invalid user ID format",
        details: error.message 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error",
        details: error.message 
      });
    }
    
    // Handle database connection errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({ 
        error: "Database connection error",
        details: "Please try again later" 
      });
    }
    
    // Generic server error
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

// Get all users with role USER (no limit)
export const getAllNormalUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "USER" }).populate("addresses");
    res.json(users);
  } catch (error) {
    console.error("Error fetching all normal users:", error);
    res.status(500).json({
      error: "Failed to fetch users",
      message: error.message
    });
  }
};
