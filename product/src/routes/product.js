import { Router } from "express";
import { 
  createProduct, 
  updateProduct,  // <-- Add this line
  deleteProduct, 
  listProducts, 
  getProductById 
} from "../controllers/product.js";


const productsRoutes = Router();

productsRoutes.post("/",  createProduct);
productsRoutes.put('/:id',  updateProduct)
productsRoutes.delete('/:id',  deleteProduct)
productsRoutes.get('/', listProducts)
// productsRoutes.get('/search',  searchProducts)
productsRoutes.get('/:id', getProductById)


export default productsRoutes;
