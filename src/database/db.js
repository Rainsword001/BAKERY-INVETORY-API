import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

export const DB = async () =>{
   try {
     await mongoose.connect(DB_URI);
    console.log('Database Connected')
   } catch (error) {
    console.log('not connected', error)
   }
}