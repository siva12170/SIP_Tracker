import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { getDashboard, getPublicDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboard);
router.get("/pdashboard", getPublicDashboard);

export default router;
