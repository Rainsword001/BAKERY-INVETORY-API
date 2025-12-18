import cron from "node-cron";
import Ingredient from "../models/ingredient.model.js";


cron.schedule('0 */6 * * *', async () => {
const lowStock = await Ingredient.find({
$expr: { $lte: ['$quantity', '$reorderLevel'] }
});

if (lowStock.length) {
console.warn('LOW STOCK ALERT');
lowStock.forEach(i => {
console.warn(`${i.name}: ${i.quantity}${i.unit}`);
});
}
});