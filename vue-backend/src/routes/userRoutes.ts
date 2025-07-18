import express from "express";
import { authController } from "../controllers/authController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// User routes
router.get("/user/:id", authenticateJWT, authController.getUserById);
router.delete("/user/:id", authenticateJWT, authController.deleteUser);

export default router;