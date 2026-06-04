import express from "express"
const router=express.Router()
import {addCompanySupply,editCompanySupply,addFieldNameSupplyinCompanySupply,listSuppliesStore} from "../../controllers/companySupply/controllersCompanySupply.js"

router.post("/addCompanySupply", addCompanySupply); 
router.put("/editCompanySupply/:idCompany", editCompanySupply);
router.put("/addFieldNameSupplyinCompanySupply", addFieldNameSupplyinCompanySupply);

//list supplies to render ecommerce page
router.get("/listSuppliesStore/:idCompany", listSuppliesStore);

export default router