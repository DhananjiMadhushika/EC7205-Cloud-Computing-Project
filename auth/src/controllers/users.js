import User from "../models/user.js";
import Address from "../models/address.js";

// Add Address
export const addAddress = async (req, res) => {
  const address = await Address.create({ ...req.body, user: req.user.userId });
  res.json(address);
};

// List Addresses
export const listAddress = async (req, res) => {
  const addresses = await Address.find({ user: req.user.userId });
  res.json(addresses);
};

// Delete Address
export const deleteAddress = async (req, res) => {
  await Address.findByIdAndDelete(req.params.id);
  res.json({ success: true });
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
  const user = await User.findById(req.params.id).populate("addresses");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};
