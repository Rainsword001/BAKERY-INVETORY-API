import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import bcrypt from "bcryptjs";

//Resgiter
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    //validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: " All fields are required" });
    }

    //check if user exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //create user
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    return res.status(201).json({ message: "New user registered" });
  } catch (error) {
    next(error);
  }
};

//Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "All fields are required" });
    }

    //validate users
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    //compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    //generate token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    next(error);
  }
};

 