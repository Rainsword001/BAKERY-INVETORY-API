import { Router } from "express";
import {
  createIngredient,
  getIngredients,
  getIngredientsById,
  updateIngredient,
  deleteIngredient,
} from "../controllers/ingredients.controller.js";
import {protect, admin} from '../middlewares/auth.middleware.js'

const ingredientsRouter = Router();

ingredientsRouter.post("/", protect, admin, createIngredient);
ingredientsRouter.get("/all", getIngredients);
ingredientsRouter.get('/ingredient/:id', getIngredientsById)
ingredientsRouter.put("/ingredient/:id", updateIngredient);
ingredientsRouter.delete("/ingredient/:id", deleteIngredient)



export default ingredientsRouter;




