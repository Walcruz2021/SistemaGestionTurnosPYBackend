import express from 'express'
const router=express.Router()
import { editDog,deleteDog,getDogxId,addDog } from "../controllers/controllersMascota.js";

router.post("/addPerro/:idClient", addDog);
router.get("/perro/:idMascota", getDogxId);
router.put("/deleteDog/:idDog", deleteDog);
router.put("/editDog/:id", editDog)
//router.post('/login',authRoutes)
//router.post('/createUserRolUserClient',createUserRolUserClient)
//router.post('/refresh-token',refreshToken)

export default router