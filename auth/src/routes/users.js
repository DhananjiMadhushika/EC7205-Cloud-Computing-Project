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


userRouter.get("/all-users", getAllNormalUsers);
userRouter.post("/address", authMiddleware, addAddress);
userRouter.get("/address", authMiddleware, listAddress);       
userRouter.delete("/address/:id", authMiddleware, deleteAddress);  
userRouter.put("/", authMiddleware, updateUser);                 
userRouter.put("/:id/role", authMiddleware, changeUserRole);       
userRouter.get("/", authMiddleware, listNormalUsers);            
userRouter.get("/:id", authMiddleware, getUserById);


export default userRouter;