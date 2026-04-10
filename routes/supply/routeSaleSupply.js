import express from "express"
const router=express.Router()       
import {listSalesTopFive,listSalesByMonth,saleByModel,addSaleSupply,listSalesByMonthNow,salesByAnio,returnSale,addFieldNameSupply} from "../../controllers/supply/controllersSaleSupply.js"


router.post("/addSaleSupply", addSaleSupply);
router.get("/getSalesByModel", saleByModel);
router.get("/getSalesByMonth/:idCompany", listSalesByMonth);
router.get("/getSalesByYear/:idCompany", salesByAnio);
router.get("/getSalesByMonthNow/:idCompany", listSalesByMonthNow);
router.get("/getSalesTopFive", listSalesTopFive);
router.put("/returnSale/:idCompany", returnSale);
router.put("/addFieldNameSupply", addFieldNameSupply);
    
export default router