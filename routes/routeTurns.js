import express from "express";


import {
  listTurnosXComp,
  addTurno,
  deleteTurno,
  editTurno,
  //addBreak
} from "../controllers/controllersTurnos.js";


const router = express.Router();


router.get("/getTurnos/:idCompany", listTurnosXComp);

router.post("/turno", addTurno);

router.delete("/deleteTurno/:idTurn", deleteTurno);

//turnosOcu=array de turnos ya ocupados
//turnosEmpr= es el array de turnos los cuales la empresa piensa abastecer
// modificacmos un turno que ya existe
router.put("/editTurno/:id", editTurno);

export default router;
