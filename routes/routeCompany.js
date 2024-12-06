import express from "express"
const router=express.Router()
import {getCompanyXId} from "../controllers/controllerCompany.js"

router.get("/getCompany/:idCompany", getCompanyXId);

router.post("/addCompany", addCompany);