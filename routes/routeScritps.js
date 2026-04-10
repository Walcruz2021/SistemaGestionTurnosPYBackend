import express from "express"
const router=express.Router()
import  {addFieldsToScript,addIdCompanySupplyToScript}  from '../controllers/scripts/controllerScripts.js';

router.put("/addFieldsToStockBatch", addFieldsToScript);
router.put("/addIdCompanySupplyToStockBatch/:idSupply", addIdCompanySupplyToScript);

export default router;