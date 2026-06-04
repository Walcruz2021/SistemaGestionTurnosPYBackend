import express from "express"
const router=express.Router()
import {addCompanySupplyVariant,getVariantsByCompanySupply,editCompanyVariantByParameter} from "../../controllers/companySupplyVariant/controllersCompanySupplyVariant.js"

router.post("/addCompanySupplyVariant", addCompanySupplyVariant); 
router.get("/getVariantsByCompanySupply/:idCompanySupply", getVariantsByCompanySupply); 
router.put("/editCompanyVariantByParameter/:idSupplyVariant", editCompanyVariantByParameter); 

export default router