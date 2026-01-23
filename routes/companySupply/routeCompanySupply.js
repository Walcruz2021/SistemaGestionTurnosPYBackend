import express from "express"
const router=express.Router()
import {addCompanySupply,editCompanySupply} from "../../controllers/companySupply/controllersCompanySupply.js"

router.post("/addCompanySupply", addCompanySupply); 
router.put("/editCompanySupply/:idCompany", editCompanySupply);

export default router