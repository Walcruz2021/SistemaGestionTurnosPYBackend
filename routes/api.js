const express = require("express");
const router = express.Router();
// const BlogPost = require('../models/blogPost');
const User = require("../models/users");
const Cliente = require("../models/cliente");
const Turno = require("../models/turno");
const Venta = require("../models/venta");
const Perro = require("../models/perro");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const { searchClient, searchallClients,listClients,listClientId,addClient,editClient,deleteClient} = require("../controllers/controllersClients.js");
const { addVenta,listVentas,ventaXanio,vtasxAnioandMesNow,vtasxAnioandMesParam,listVentasxId,ventasxIdClient} = require("../controllers/controllersVentas.js");
const {listTurnos,addTurno,deleteTurno,editTurno} = require("../controllers/controllersTurnos.js");
const {editDog,deleteDog,addDog,getDogxId} = require("../controllers/controllersDog.js");

const perro = require("../models/perro");
const { findByIdAndUpdate } = require("../models/users");

router.get("/listClients", listClients);

//     //si no coloco el async y el await se enviara a la consola respuestas antes
//     //de terminar de hacer la bsusqueda por completo de la BD y tirara errores
//     //busqueda de todos los registros que existen en la BD
//     const clientes = await Cliente.find();
//     console.log("clientes")
//     //res.send("hola mundo")
//     res.json({
//         clientes: clientes
//     })
//

router.delete("/deleteClient/:id", deleteClient);

router.get("/listClients/:id", listClientId);

router.post("/client", addClient);

router.post("/addVentas/:idClient", addVenta);

router.get("/listVentas", listVentas);

// recibira idclient y buscara en la coleccion de ventas, las que tengan incorporados el idClient
router.get("/ventaCli/:idDog", ventasxIdClient);

router.get("/ventasxAnio/:anio",ventaXanio);

router.get("/vtasxAnioandMesNow",vtasxAnioandMesNow );

router.get("/vtasxAnioandMesParam/:date",vtasxAnioandMesParam);

router.get("/listVentas/:id", listVentasxId);

router.get("/getTurnos", listTurnos);

router.post("/turno", addTurno);

router.delete("/deleteTurno/:id",deleteTurno);

// modificacmos un turno que ya existe
router.put("/editTurno/:id", editTurno);
/// ////////////////////////PERROS//////////////////////////////

router.post("/addPerro/:id", addDog);

router.get("/perro/:id", getDogxId);



router.put("/deleteDog/:idDog", deleteDog);


// modificacmos un cliente que ya existe
router.put("/editClient/:id", editClient);


router.put("/editDog/:id", editDog)

module.exports = router;
