import express from "express";
import { createFund, getFunds, updateFundNAV } from "../controllers/fund.controller.js";

const router = express.Router();

router.post("/", createFund);
router.get("/", getFunds);
router.put("/:fundId/nav", updateFundNAV);

export default router;