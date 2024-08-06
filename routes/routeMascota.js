const express=require("express")
const router=express.Router()
const {editDog,deleteDog,getDogxId,addDog}=require("../controllers/controllersMascota")


router.post("/addPerro/:idClient", addDog);
router.get("/perro/:id", getDogxId);
router.put("/deleteDog/:idDog", deleteDog);
router.put("/editDog/:id", editDog)
//router.post('/login',authRoutes)
//router.post('/createUserRolUserClient',createUserRolUserClient)
//router.post('/refresh-token',refreshToken)

module.exports=router