import { Router } from "express";
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getUserById,
  listAddress,
  listNormalUsers,
  updateUser,
  getAllNormalUsers,
} from "../controllers/users.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = Router();

// Add authMiddleware to all routes that need req.user
userRouter.get("/all-users", getAllNormalUsers);
userRouter.post("/address", authMiddleware, addAddress);
userRouter.get("/address", authMiddleware, listAddress);           // Added authMiddleware
userRouter.delete("/address/:id", authMiddleware, deleteAddress);  // Added authMiddleware
userRouter.put("/", authMiddleware, updateUser);                   // Added authMiddleware
userRouter.put("/:id/role", authMiddleware, changeUserRole);       // Added authMiddleware
userRouter.get("/", authMiddleware, listNormalUsers);              // Added authMiddleware
userRouter.get("/:id", authMiddleware, getUserById);


export default userRouter;