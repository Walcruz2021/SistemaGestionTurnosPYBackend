import express from "express"
const router=express.Router()       
import {listSalesTopFive,listSalesByMonth,saleByModel,addSaleSupply,listSalesByMonthNow,salesByAnio} from "../../controllers/supply/controllersSaleSupply.js"


router.post("/addSaleSupply", addSaleSupply);
router.get("/getSalesByModel", saleByModel);
router.get("/getSalesByMonth/:idCompany", listSalesByMonth);
router.get("/getSalesByYear/:idCompany", salesByAnio);
router.get("/getSalesByMonthNow/:idCompany", listSalesByMonthNow);
router.get("/getSalesTopFive", listSalesTopFive);
    
export default router