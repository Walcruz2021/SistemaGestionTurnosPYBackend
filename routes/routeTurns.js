import express from "express";


import {
  listTurnosXComp,
  addTurno,
  deleteTurno,
  editTurno,
  //addBreak
} from "../controllers/controllersTurnos.js";

import { sendNotifications } from "./alertScheduler.js";
const router = express.Router();


router.get("/getTurnos/:idCompany", listTurnosXComp);

router.post("/turno", addTurno);

router.delete("/deleteTurno/:idTurn", deleteTurno);

//turnosOcu=array de turnos ya ocupados
//turnosEmpr= es el array de turnos los cuales la empresa piensa abastecer
// modificacmos un turno que ya existe
router.put("/editTurno/:id", editTurno);

router.get("/send-alerts-now", async (req, res) => {
  try {
    await sendNotifications();
    res.status(200).send("Notificaciones enviadas correctamente.");
  } catch (err) {
    console.error("Error al enviar notificaciones:", err);
    res.status(500).send("Hubo un error al enviar las notificaciones.");
  }
});

export default router;
