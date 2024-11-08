import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Importaciones de controladores
import {
  listClients,
  listClientId,
  addClient,
  editClient,
  deleteClient,
} from "../controllers/controllersClients.js";

import {
  addVenta,
  listVentas,
  ventaXanio,
  vtasxAnioandMesNow,
  vtasxAnioandMesParam,
  listVentasxId,
  ventasxIdClient,
} from "../controllers/controllersVentas.js";

import {
  listTurnos,
  addTurno,
  deleteTurno,
  editTurno,
  //addBreak
} from "../controllers/controllersTurnos.js";

import {
  authRoutes,
  createUserRolUserClient,
} from "../controllers/controllersUserAdmin.js";

import {
  addUser,
  validationCompanyExist,
  searchUser,
} from "../controllers/controllersUser.js";

//import { refreshToken } from "../controllers/controllersRefreshToken.js";

//import { checkAuth } from "../middleware/auth.js";

import perro from "../models/perro.js";

import { addCompany, getCompany } from "../controllers/controllerCompany.js";

const router = express.Router();

//const { findByIdAndUpdate } = require("../models/users");

router.delete("/deleteClient/:id", deleteClient);
router.put("/editClient/:id", editClient);
router.get("/listClientsCompany/:id", listClients);

//find Client by idClient
router.get("/listClients/:id", listClientId);
router.post("/client", addClient);

//VENTAS

router.post("/addVentas/:idClient", addVenta);

router.get("/listVentas", listVentas);

// recibira idclient y buscara en la coleccion de ventas, las que tengan incorporados el idClient
router.get("/ventaCli/:idDog", ventasxIdClient);

router.get("/ventasxAnio/:idCompany", ventaXanio);

router.get("/vtasxAnioandMesNow/:idCompany", vtasxAnioandMesNow);

router.get("/vtasxAnioandMesParam/:idCompany", vtasxAnioandMesParam);

router.get("/listVentas/:id", listVentasxId);

//TURNOS

router.get("/getTurnos/:id", listTurnos);

router.post("/turno", addTurno);

router.delete("/deleteTurno/:id", deleteTurno);

//turnosOcu=array de turnos ya ocupados
//turnosEmpr= es el array de turnos los cuales la empresa piensa abastecer
// modificacmos un turno que ya existe
router.put("/editTurno/:id", editTurno);
/// ////////////////////////PERROS//////////////////////////////

//COMPANY

router.get("/getCompany/:id", getCompany);
router.post("/addCompany", addCompany);

//USER
router.post("/addUser", addUser);
router.get("/validationCompanyExist/:email", validationCompanyExist);
router.get("/searchUser/:email", searchUser);

export default router;
