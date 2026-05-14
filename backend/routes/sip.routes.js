import express from "express";
import { createSIP, getSIPs, getSIP, processSIP, getSIPTransactions } from "../controllers/sip.controller.js";

const router = express.Router();

router.post("/", createSIP);
router.get("/", getSIPs);
router.get("/:sipId", getSIP);
router.post("/:sipId/process", processSIP);
router.get("/:sipId/transactions", getSIPTransactions);

export default router;