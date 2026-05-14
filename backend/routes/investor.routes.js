import express from "express";
import { createInvestor, getInvestors, getInvestor, getInvestorHoldings, getInvestorNetWorth } from "../controllers/investor.controller.js";

const router = express.Router();

router.post("/", createInvestor);
router.get("/", getInvestors);
router.get("/:investorId", getInvestor);
router.get("/:investorId/holdings", getInvestorHoldings);
router.get("/:investorId/networth", getInvestorNetWorth);

export default router;