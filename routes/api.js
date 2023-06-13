const express = require("express");
const router = express.Router();
// const BlogPost = require('../models/blogPost');
const res = require("express/lib/response");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { searchClient, searchallClients,listClients,listClientId,addClient,editClient,deleteClient} = require("../controllers/controllersClients.js");
const { addVenta,listVentas,ventaXanio,vtasxAnioandMesNow,vtasxAnioandMesParam,listVentasxId,ventasxIdClient} = require("../controllers/controllersVentas.js");
const {listTurnos,addTurno,deleteTurno,editTurno,availableTurns} = require("../controllers/controllersTurnos.js");
const {editDog,deleteDog,addDog,getDogxId} = require("../controllers/controllersDog.js");
const {authRoutes,createUser} = require("../controllers/controllersUserAdmin.js");

const perro = require("../models/perro");
//const { findByIdAndUpdate } = require("../models/users");


router.delete("/deleteClient/:id",deleteClient);
router.put("/editClient/:id", editClient);
router.get("/listClients", listClients);
router.get("/listClients/:id", listClientId);
router.post("/client", addClient);

//VENTAS

router.post("/addVentas/:idClient", addVenta);

router.get("/listVentas", listVentas);

// recibira idclient y buscara en la coleccion de ventas, las que tengan incorporados el idClient
router.get("/ventaCli/:idDog", ventasxIdClient);

router.get("/ventasxAnio/:anio",ventaXanio);

router.get("/vtasxAnioandMesNow",vtasxAnioandMesNow );

router.get("/vtasxAnioandMesParam/:date",vtasxAnioandMesParam);

router.get("/listVentas/:id", listVentasxId);

//TURNOS

router.get("/getTurnos", listTurnos);

router.post("/turno", addTurno);

router.delete("/deleteTurno/:id",deleteTurno);

router.get("/availableTurns",availableTurns)

// modificacmos un turno que ya existe
router.put("/editTurno/:id", editTurno);
/// ////////////////////////PERROS//////////////////////////////

//DOG
router.post("/addPerro/:id", addDog);

router.get("/perro/:id", getDogxId);

router.put("/deleteDog/:idDog", deleteDog);

router.put("/editDog/:id", editDog)
router.post('/login',authRoutes)
router.post('/createUser',createUser)
module.exports = router;
