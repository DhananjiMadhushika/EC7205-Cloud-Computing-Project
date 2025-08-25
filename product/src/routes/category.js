import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.js";


const categoryRouter = Router();

categoryRouter.post("/",  createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.put("/:id",  updateCategory);
categoryRouter.delete("/:id",  deleteCategory);

export default categoryRouter;
