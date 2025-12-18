const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["incoming", "outgoing"], required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
