import express from "express"
const router=express.Router()
import {listVentas,ventaXanio,vtasxAnioandMesNow,listVentasxId,ventasxIdDog,addVenta,vtasxAnioandMesParam,ventasxIdCli} from "../controllers/controllersVentas.js"

router.get("/listVentas", listVentas)
router.get("/ventasxAnio/:idCompany", ventaXanio);
router.get("/vtasxAnioandMesNow/:idCompany", vtasxAnioandMesNow);
router.get("/listVentas/:idVta", listVentasxId);
// recibira idDog y buscara en la coleccion de ventas, las que tengan incorporados el idClient
router.get("/ventaCli/:idDog", ventasxIdDog);
router.get("/ventaPaciente/:idCli", ventasxIdCli);

    // {
    // "mes":"07",
    // "año":"2024",
    // "idTurno":"6672d62ce71ae141a4cc4ce9",
    // "name": "walter cruz",
    // "nameDog": "pichichu",
    // "notesTurn": "xxxx",
    // "tipoServ":"corte",
    // "valorServ":"5000",
    // "idCompany": "666c380b9ad31c41901bb496",
    // "idDog":"666c4c769ad31c41901bb5f8",
    // "date":"2024-07-18"
    // }
//based on the idTurno the idDog and idCompany will be obtained
router.post("/addVentas/:idClient", addVenta);
router.get("/vtasxAnioandMesParam/:idCompany", vtasxAnioandMesParam);

export default router
