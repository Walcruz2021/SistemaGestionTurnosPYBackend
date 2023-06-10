const Cliente = require('../models/cliente')
const Turno = require('../models/turno')

const listTurnos=async (req, res) => {
  // si no coloco el async y el await se enviara a la consola respuestas antes
  // de terminar de hacer la bsusqueda por completo de la BD y tirara errores
  // busqueda de todos los registros que existen en la BD
  const turnos = await Turno.find();
  console.log("turnos");
  // res.send("hola mundo")

  res.json({
    turnos,
  });
}

const addTurno=async (req, res, next) => {
  const { name, nameDog, phone, date, notesTurn, idClient, time, idDog } =
    req.body;
  const turno = new Turno({
    name,
    nameDog,
    phone,
    date,
    notesTurn,
    idClient,
    time,
    idDog,
  });
  try {
    const cliente = await Cliente.findById(req.body.idClient);
    // console.log(cliente)
    turno.seller = cliente;
    await turno.save();

    cliente.turnos.push(turno);
    await cliente.save();
    res.send(turno);
    res.status(200).json({
      status: "turno agendado",
    });
  } catch (err) {
    next(err);
  }
}

const deleteTurno=async (req, res) => {
  await Turno.findByIdAndRemove(req.params.id, { userFindAndModify: false })
    .then(() =>
      res.json({
        status: "TURNO ELIMINADO",
      })
    )
    .catch((err) => res.status(400).json("Error: " + err));
}

const editTurno=async (req, res) => {
  const { date, time, notesTurn } = req.body;
  const newTurno = {
    date,
    time,
    notesTurn,
  };
  await Turno.findByIdAndUpdate(req.params.id, newTurno, {
    userFindAndModify: false,
  });
  res.json({
    status: "turno actualizado",
  });
}

module.exports={
    listTurnos,
    addTurno,
    deleteTurno,
    editTurno
}