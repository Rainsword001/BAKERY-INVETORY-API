const mongoose = require('mongoose');


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


module.exports = mongoose.model('Product', productSchema);