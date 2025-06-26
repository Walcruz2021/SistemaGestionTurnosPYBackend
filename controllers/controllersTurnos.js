import { assertValidExecutionArguments } from "graphql/execution/execute.js";
import Cliente from "../models/cliente.js";
import Turno from "../models/turno.js";
import UserAdmin from "../models/user.js";
//const Break=require("../models/break.js")
// si no coloco el async y el await se enviara a la consola respuestas antes
// de terminar de hacer la bsusqueda por completo de la BD y tirara errores
// busqueda de todos los registros que existen en la BD

export const addTurno = async (req, res, next) => {
  const {
    name,
    nameDog,
    phone,
    date,
    notesTurn,
    idClient,
    time,
    idDog,
    Company,
  } = req.body;
  const turno = new Turno({
    name,
    nameDog,
    phone,
    date,
    notesTurn,
    idClient,
    time,
    idDog,
    Company,
  });

  try {
    const cliente = await Cliente.findById(req.body.idClient);
  
    //console.log(cliente)
    if (!cliente) {
      return res.status(204).json({
        msg: "Client not found",
      });
    }
    turno.Client = cliente._id;
    await turno.save();

    cliente.turnos.push(turno._id);
    await cliente.save();
    
// Convierte el turno a objeto plano y elimina posibles referencias circulares
    const turnoObj = turno.toObject();
    res.status(200).json({
      status: "turno agendado",
      turno: turnoObj,
    });
  } catch (err) {
    next(err);
  }
};

//al eliminar un turno debe quitarse el idTurn del array turnos de la coleccion clientes
//luego se elimina el turno seleccionado
export const deleteTurno = async (req, res) => {
  const { idTurn } = req.params;

  const clientFind = await Cliente.findOneAndUpdate(
    { turnos: idTurn },
    {
      $pull: { turnos: idTurn },
    }
  );

  const turnFind = await Turno.findOneAndDelete({_id:idTurn});

  if(clientFind && turnFind){
    res.status(200).json({
      "msg":"Turn deleted"
    })
  }else{
    res.status(400).json({
      "msg":"turn or client not found"
    })
  }


};

export const editTurno = async (req, res) => {
  const { date, time, notesTurn, isNotifications,receta,vacunas,tratamiento,peso,statusFile} = req.body;

  const newTurno = {
    date,
    time,
    notesTurn,
    isNotifications,
    receta,
    vacunas,
    tratamiento,
    peso,
    statusFile
  };
  await Turno.findByIdAndUpdate(req.params.id, newTurno, {
    userFindAndModify: false,
  });
  res.status(200).json({
    status: "turno actualizado",
  });
};

//postman OK
//graphQL OK
export const listTurnosXComp = async (req, res) => {
  const { idCompany } = req.params;

  try {
    const turnos = await Turno.find({ Company: idCompany });

    if (turnos.length > 0) {
      res.status(200).json({
        turnos,
      });
    } else {
      res.status(204).json({
        msg: "not found turnos",
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
