import express from "express"
const router=express.Router()
import  {addGastos,getGastosDirXanio,gtosXanio,getGastosIndXanio,gastosXanioandMesNow,gastosXanioandMesParam} from "../controllers/controllersGastos.js"


router.post("/addGastos",addGastos)
router.get("/getGastosDirXanio/:idCompany",getGastosDirXanio)
router.get("/getGastosIndXanio/:idCompany",getGastosIndXanio)
router.get("/gastosXanioandMesNow/:idCompany",gastosXanioandMesNow );
router.get("/gastosXanioandMesParam/:idCompany",gastosXanioandMesParam);
router.get("/gtosXanio/:idCompany",gtosXanio);

export default router