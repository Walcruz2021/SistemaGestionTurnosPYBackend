const express=require("express")
const router=express.Router()
const {addGastos,getGastosDirXanio,gtosXanio,getGastosIndXanio,gastosXanioandMesNow,gastosXanioandMesParam}=require("../controllers/controllersGastos")


router.post("/addGastos",addGastos)
router.get("/getGastosDirXanio/:idCompany",getGastosDirXanio)
router.get("/getGastosIndXanio/:idCompany",getGastosIndXanio)
router.get("/gastosXanioandMesNow/:idCompany",gastosXanioandMesNow );
router.get("/gastosXanioandMesParam/:idCompany",gastosXanioandMesParam);
router.get("/gtosXanio/:idCompany",gtosXanio);

module.exports=router