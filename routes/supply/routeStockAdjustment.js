
import express from 'express';
const router = express.Router();
import { createStockAdjustment } from "../../controllers/supply/controllersStockAdjustment.js";

router.post("/addStockAdjustment", createStockAdjustment);

export default router