import express from "express"
const router=express.Router()
import {addCompanySupply} from "../controllers/controllersCompanySupply.js"

router.post("/addCompanySupply", addCompanySupply); 

export default router