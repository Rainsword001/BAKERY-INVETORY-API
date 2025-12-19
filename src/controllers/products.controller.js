import Product from "../models/product.model.js";
import Ingredient from "../models/ingredient.model.js";
import mongoose from "mongoose";


export const createProduct = async (req, res) => {
  try {
    const { name, price = 0, stock = 0, recipe = [] } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    // Prevent duplicates
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({ message: 'Product already exists' });
    }

    // Create product
    const product = await Product.create({
      name: name.trim(),
      price,
      stock,
      recipe
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ message: 'Failed to create product' });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ message: 'Failed to update product' });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};


// sell products (outgoing order) - deduct stock and ingredients
export const sellProducts = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body; // [{ product: id, quantity }]

    if (!items || !items.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'No items provided' });
    }

    for (const it of items) {
      const product = await Product.findById(it.product)
        .populate('recipe.ingredient')
        .session(session);

      if (!product) {
        throw new Error(`Product not found`);
      }

      if (product.stock < it.quantity) {
        throw new Error(`Insufficient product stock for ${product.name}`);
      }

      // Deduct product stock
      product.stock -= it.quantity;
      await product.save({ session });

      // Deduct ingredients
      for (const r of product.recipe) {
        const needed = r.qty * it.quantity;

        const ingredient = await Ingredient.findById(r.ingredient._id)
          .session(session);

        if (!ingredient) {
          throw new Error('Ingredient not found');
        }

        if (ingredient.quantity < needed) {
          throw new Error(`Insufficient ingredient ${ingredient.name}`);
        }

        ingredient.quantity -= needed;
        await ingredient.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.json({ message: 'Sale recorded successfully' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Sell products error:', error);
    return res.status(400).json({ message: error.message });
  }
};
