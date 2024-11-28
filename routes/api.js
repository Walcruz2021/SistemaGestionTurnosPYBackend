const express = require("express");
const router = express.Router();
// const BlogPost = require('../models/blogPost');
const res = require("express/lib/response");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { searchClient, searchallClients,listClients,listClientId,addClient,editClient,deleteClient} = require("../controllers/controllersClients.js");
const { addVenta,listVentas,ventaXanio,vtasxAnioandMesNow,vtasxAnioandMesParam,listVentasxId,ventasxIdClient} = require("../controllers/controllersVentas.js");
const {listTurnos,addTurno,deleteTurno,editTurno,availableTurns,addBreak} = require("../controllers/controllersTurnos.js");
const {authRoutes,createUserRolUserClient} = require("../controllers/controllersUserAdmin.js");
const {addUser,validationCompanyExist,searchUser}=require("../controllers/controllersUser.js")
const {refreshToken} =require ("../controllers/controllersRefreshToken.js")
const {checkAuth} =require("../middleware/auth.js")
const perro = require("../models/perro");
const{addCompany,getCompany}=require ("../controllers/controllerCompany.js")

//const { findByIdAndUpdate } = require("../models/users");


router.delete("/deleteClient/:id",deleteClient);
router.put("/editClient/:id", editClient);
router.get("/listClientsCompany/:id", listClients);
router.get("/listClients/:id", listClientId);


//VENTAS

router.post("/addVentas/:idClient", addVenta);

router.get("/listVentas", listVentas);

// recibira idclient y buscara en la coleccion de ventas, las que tengan incorporados el idClient
router.get("/ventaCli/:idDog", ventasxIdClient);

router.get("/ventasxAnio/:idCompany",ventaXanio);

router.get("/vtasxAnioandMesNow/:idCompany",vtasxAnioandMesNow );

router.get("/vtasxAnioandMesParam/:idCompany",vtasxAnioandMesParam);

router.get("/listVentas/:id", listVentasxId);

//TURNOS

router.get("/getTurnos/:id",listTurnos);

router.post("/turno", addTurno);

router.delete("/deleteTurno/:id",deleteTurno);

router.post("/addBreak",addBreak);

//turnosOcu=array de turnos ya ocupados
//turnosEmpr= es el array de turnos los cuales la empresa piensa abastecer
// modificacmos un turno que ya existe
router.put("/editTurno/:id", editTurno);
/// ////////////////////////PERROS//////////////////////////////

//COMPANY   

router.get("/getCompany/:id",getCompany)
router.post("/addCompany",addCompany)

//USER
router.post("/addUser",addUser);
router.get("/validationCompanyExist/:email",validationCompanyExist)
router.get("/searchUser/:email",searchUser)
module.exports = router;
