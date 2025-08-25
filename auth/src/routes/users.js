import { Router } from "express";
import { addAddress, listAddress, deleteAddress, updateUser, changeUserRole, listNormalUsers, getUserById } from "../controllers/users.js";

const userRouter = Router();

userRouter.post("/address", addAddress );
userRouter.get("/address",  listAddress);
userRouter.delete("/address/:id", deleteAddress);
userRouter.put("/",  updateUser);
userRouter.put("/:id/role",  changeUserRole);
userRouter.get("/",  listNormalUsers);
userRouter.get("/:id",  getUserById);

export default userRouter;
