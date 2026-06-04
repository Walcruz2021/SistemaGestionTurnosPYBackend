import express from "express"
const router=express.Router()

import {addCategory,getCategories} from "../../controllers/category/controllersCategory.js"

router.get("/getCategories", getCategories);

router.post("/addCategory", addCategory);

export default router