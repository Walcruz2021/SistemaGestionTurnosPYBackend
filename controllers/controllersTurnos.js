const Cliente = require('../models/cliente')
const Turno = require('../models/turno')
// si no coloco el async y el await se enviara a la consola respuestas antes
// de terminar de hacer la bsusqueda por completo de la BD y tirara errores
// busqueda de todos los registros que existen en la BD

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
      res.status(200).json({
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
  res.status(200).json({
    status: "turno actualizado",
  });
}

const listTurnos=async (req,res) => {
  try {
    const turnos = await Turno.find();
    if(turnos){
      res.status(200).json({
        turnos
      })
    }
  } catch (error) {
    console.error(error);
    throw error; 
  }

}

//turnosOcu=array de turnos ya ocupados
//turnosEmpr= es el array de turnos los cuales la empresa piensa abastecer

const availableTurns=async (turnosOcu,turnosEmpr)=>{
  try{
    const turnosTime  =turnos.map((turn)=>turn.time)
    res.status(200).json({
      turnosTime 
    })
}catch(err){
res.status(500).json({
  status:"error al obtener turnos disponibles"
})
}

}

module.exports={
    listTurnos,
    addTurno,
    deleteTurno,
    editTurno,
    availableTurns
}