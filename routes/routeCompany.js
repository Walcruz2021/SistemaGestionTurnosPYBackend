import express from "express"
const router=express.Router()
import {getCompanyXId,addCompany} from "../controllers/controllerCompany.js"

router.get("/getCompany/:idCompany", getCompanyXId);

router.post("/addCompany", addCompany);

export default router