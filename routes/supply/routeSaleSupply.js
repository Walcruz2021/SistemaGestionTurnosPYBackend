import express from "express"
const router=express.Router()       
import {listSalesTopFive,listSalesByMonth,saleByModel,addSaleSupply} from "../../controllers/supply/controllersSaleSupply.js"


router.post("/addSaleSupply", addSaleSupply);
router.get("/getSalesByModel", saleByModel);
router.get("/getSalesByMonth", listSalesByMonth);
router.get("/getSalesTopFive", listSalesTopFive);
    
export default router