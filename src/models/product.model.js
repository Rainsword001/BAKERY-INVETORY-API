import mongoose  from "mongoose";


const productSchema = new mongoose.Schema({
name: { type: String, required: true },
price: { type: Number, default: 0 },
stock: { type: Number, default: 0 },
// recipe: list of ingredients and quantity used per product unit
recipe: [{
ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
qty: { type: Number, required: true }
}]
}, { timestamps: true });


const Product = mongoose.model('Product', productSchema);

export default Product;