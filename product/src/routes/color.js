import { Router } from "express";
import { createColor, deleteColor, getColors, updateColor } from "../controllers/color.js";



const colorRouter = Router();

colorRouter.post("/", createColor);
colorRouter.get("/", getColors);
colorRouter.put("/:id", updateColor);
colorRouter.delete("/:id", deleteColor);

export default colorRouter;
