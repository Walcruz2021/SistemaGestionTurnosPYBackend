import express from "express"
const router=express.Router()       
import {addSaleSupply} from "../../controllers/supply/controllersSaleSupply.js"


router.post("/addSaleSupply", addSaleSupply);

export default router