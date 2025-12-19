import Ingredient from "../models/ingredient.model.js";
import mongoose from "mongoose";

export const createIngredient = async (req, res, next) => {
  try {
    const { name, quantity = 0, unit, reorderLevel = 10, supplier } = req.body;

    if (!name || !unit || !supplier) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (quantity < 0 || reorderLevel < 0) {
      return res.status(400).json({
        message: "Quantity and reorder level cannot be negative",
      });
    }

    const exists = await Ingredient.findOne({
      name: name.trim().toLowerCase(),
    });

    if (exists) {
      return res.status(400).json({
        message: "Ingredient already exists",
      });
    }

    const ingredient = await Ingredient.create({
      name: name.trim(),
      quantity,
      unit,
      reorderLevel,
      supplier,
    });

    return res.status(201).json(ingredient);
  } catch (error) {
    next(error);
  }
};

export const getIngredients = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const ingredients = await Ingredient.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Ingredient.countDocuments(query);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: ingredients,
    });
  } catch (error) {
    next(error);
  }
};

export const getIngredientsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(401).json({ message: "invalid id" });
    const ingredients = await Ingredient.findById(id);

    return res.status(200).json({ 
      name: ingredients.name,
      quantity: ingredients.quantity,
      units: ingredients.unit,
      reorderLevel: ingredients.reorderLevel,
      supplier: ingredients.supplier
     });
  } catch (error) {
    next(error);
  }
};



export const updateIngredient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowedUpdates = [
      "name",
      "quantity",
      "unit",
      "reorderLevel",
      "supplier",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID" });
    }

    const ingredient = await Ingredient.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    return res.status(200).json(ingredient);
  } catch (error) {
    next(error);
  }
};

export const deleteIngredient = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID" });
    }

    const ingredient = await Ingredient.findByIdAndDelete(id);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    return res.status(200).json({
      message: "Ingredient deleted successfully",
      deleted: ingredient,
    });
  } catch (error) {
    next(error);
  }
};
