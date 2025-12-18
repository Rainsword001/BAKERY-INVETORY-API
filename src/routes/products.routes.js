import { Router } from "express";

import  {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  sellProducts,
} from '../controllers/products.controller.js'
import { protect, admin } from "../middlewares/auth.middleware.js";

const productRouter = Router()

productRouter.post('/', protect, admin, createProduct);
productRouter.get('/:id', protect, getProducts);
productRouter.patch('/:id', protect, admin, updateProduct);
productRouter.delete('/:id', protect, admin, deleteProduct);

//SELL PRODUCTS
productRouter.post('/sell', protect, sellProducts)


export default productRouter;