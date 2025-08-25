import { Router } from "express";
import AuthController from "../controllers/auth.js";

const authRouter = Router();

// authRouter.post("/google", AuthController.googleAuth);
authRouter.post("/signup", AuthController.signup);
authRouter.post("/login", AuthController.login);
authRouter.get("/me", AuthController.me);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/reset-password", AuthController.resetPassword);
authRouter.post("/change-password",  AuthController.changePassword);



export default authRouter;
