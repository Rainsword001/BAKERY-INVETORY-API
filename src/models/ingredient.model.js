import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true }, // e.g., kg, L, pcs
    reorderLevel: { type: Number, default: 10 },
    supplier: { type: String, requiered: true},
  },
  { timestamps: true }
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);
export default Ingredient;
