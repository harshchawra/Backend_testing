import express from "express";
import { checkAuth, signupUser, logoutUser, loginUser } from "../controllers/auth.controller.js";
import authenticateUser from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser); 

router.get("/me", authenticateUser, checkAuth); //Returns Currently authenticated User Details

export default router;
