import express from "express"
const router=express.Router()
import {addCompanySupply,editCompanySupply,addFieldNameSupplyinCompanySupply} from "../../controllers/companySupply/controllersCompanySupply.js"

router.post("/addCompanySupply", addCompanySupply); 
router.put("/editCompanySupply/:idCompany", editCompanySupply);
router.put("/addFieldNameSupplyinCompanySupply", addFieldNameSupplyinCompanySupply);

export default router