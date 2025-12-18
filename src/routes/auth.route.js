import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const authRouter = Router();

//End Points

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
