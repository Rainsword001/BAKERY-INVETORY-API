import Product from "../models/product.model.js";
import Ingredient from "../models/ingredient.model.js";

export const createProduct = async (req, res) => {
const { name, price = 0, stock = 0, recipe = [] } = req.body;
const product = await Product.create({ name, price, stock, recipe });
res.status(201).json(product);
};


export const getProducts = async (req, res) => {
const products = await Product.find().populate('recipe.ingredient', 'name unit');
res.json(products);
};


export const updateProduct = async (req, res) => {
const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!product) return res.status(404).json({ message: 'Product not found' });
res.json(product);
};


export const deleteProduct = async (req, res) => {
const product = await Product.findByIdAndDelete(req.params.id);
if (!product) return res.status(404).json({ message: 'Product not found' });
res.json({ message: 'Deleted' });
};


// sell products (outgoing order) - deduct stock and ingredients
export const sellProducts = async (req, res) => {
const { items } = req.body; // [{ product: id, quantity }]
if (!items || !items.length) return res.status(400).json({ message: 'No items' });


// simple transaction-like flow (not real DB transaction here)
for (const it of items) {
const prod = await Product.findById(it.product).populate('recipe.ingredient');
if (!prod) return res.status(404).json({ message: `Product ${it.product} not found` });
if (prod.stock < it.quantity) return res.status(400).json({ message: `Insufficient product stock for ${prod.name}` });


// deduct product stock
prod.stock -= it.quantity;
await prod.save();


// deduct ingredients
for (const r of prod.recipe) {
const needed = r.qty * it.quantity;
const ingredient = await Ingredient.findById(r.ingredient._id);
if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
if (ingredient.quantity < needed) return res.status(400).json({ message: `Insufficient ingredient ${ingredient.name}` });
ingredient.quantity -= needed;
await ingredient.save();
}
}


res.json({ message: 'Sale recorded' });
};