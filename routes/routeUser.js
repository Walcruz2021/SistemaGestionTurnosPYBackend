import express from "express"
const router=express.Router()
import {addUser,validationCompanyExist,searchUser} from "../controllers/controllersUser.js"

router.post("/addUser", addUser);

router.get("/validationCompanyExist/:email", validationCompanyExist);

router.get("/searchUser/:email", searchUser);

export default router