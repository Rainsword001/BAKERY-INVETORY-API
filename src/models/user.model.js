import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
name: { type: String, required: true, tirm: true},
email: { type: String, required: true, unique: true, trim:true, lowercase: true,
      match:[/\S+.\S+@\S./], },
password: { type: String, required: true },
role: { type: String, enum: ['admin', 'staff'], default: 'staff' }
}, { timestamps: true });




const User = mongoose.model('User', userSchema);

export default User;