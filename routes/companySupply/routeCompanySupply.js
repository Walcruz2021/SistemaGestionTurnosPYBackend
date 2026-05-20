import express from "express"
const router=express.Router()
import {addCompanySupply,editCompanySupply,addFieldNameSupplyinCompanySupply,addFieldVisibleStoreinCompanySupply,editCompanySupplyByParameters} from "../../controllers/companySupply/controllersCompanySupply.js"

router.post("/addCompanySupply", addCompanySupply); 
router.put("/editCompanySupply/:idCompany", editCompanySupply);
router.put("/addFieldNameSupplyinCompanySupply", addFieldNameSupplyinCompanySupply);
router.put("/addFieldVisibleStoreinCompanySupply", addFieldVisibleStoreinCompanySupply);
router.put("/editCompanySupplyByParameters/:idCompanySupply", editCompanySupplyByParameters);

export default router