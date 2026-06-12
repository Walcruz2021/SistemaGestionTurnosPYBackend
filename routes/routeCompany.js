import express from "express"
const router = express.Router()
import { getCompanyXId, addCompany, getCompanyBySlugCompany } from "../controllers/controllerCompany.js"

router.get("/getCompany/:idCompany", getCompanyXId);
router.get("/getCompanyBySlugCompany/:slugCompany", getCompanyBySlugCompany);

router.post("/addCompany", addCompany);

export default router