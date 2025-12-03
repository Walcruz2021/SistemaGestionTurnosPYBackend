import express from "express"
const router=express.Router()
import {getStockBatchesByIdSupply} from "../controllers/controllersStockBatch.js"


router.get("/getStockBatchesByIdSupply/:idSupply", getStockBatchesByIdSupply);

export default router;