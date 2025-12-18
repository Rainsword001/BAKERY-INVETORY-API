import { Router } from "express";

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  sellProducts,
} = require("../controllers/products.controller.js");
const { protect, admin } = require("../middlewares/auth.middleware.js");

const productRouter = Router()

productRouter.post('/', protect, admin, createProduct);
productRouter.get('/:id', protect, getProducts);
productRouter.patch('/:id', protect, admin, updateProduct);
productRouter.delete('/:id', protect, admin, deleteProduct);

//SELL PRODUCTS
productRouter.post('/sell', protect, sellProducts)


export default productRouter;