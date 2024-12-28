import Cliente from "../models/cliente.js"
import Perro from "../models/perro.js";

export const editDog = async (req, res) => {
  const idDog = req.params.id;
  const { nameDog, notaP, raza, tamaño } = req.body;
  const newDog = {
    nameDog,
    notaP,
    raza,
    tamaño,
  };
  await Perro.findByIdAndUpdate(idDog, newDog, {
    userFindAndModify: true,
  });

  res.status(200).json({
    msg: "mascota actualizada",
  });
};

export const deleteDog = async (req, res) => {
  console.log(req.params.idDog);
  const newStatus = {
    status: false,
  };

  await Perro.findByIdAndUpdate(req.params.idDog, newStatus, {
    userFindAndModify: false,
  })
    .then(() =>
      res.json({
        status: "DOG MODIFICADO",
      })
    )
    .catch((err) => res.status(400).json("Error:" + err));
};

export const addDog = async (req, res, next) => {
  const { nameDog, raza, tamaño, notaP } = req.body;
  const perro = new Perro({
    nameDog,
    raza,
    tamaño,
    notaP,
    status: true,
  });
  try {
    const cliente = await Cliente.findById(req.params.idClient);
    console.log(cliente);
    // se guarda en el campo perro.client el id del cliente al que se le va a guardar el perro
    perro.client = cliente;
    await perro.save();
    // perro es el arrayq ue tengo en el modelo el cual va  a guarar el listado de perros
    cliente.perros.push(perro);
    await cliente.save();
    res.send(perro);
    res.json({
      status: "perro agendado",
    });
  } catch (err) {
    next(err);
  }
};

export const getDogxId = async (req, res) => {
  const {idMascota}=req.params

  if(idMascota) {
    const buscado = await Perro.findById({_id : idMascota});
    if (buscado) {
      res.status(200).json({ buscado });
    } else {
      res.status(404).json({ msg: "pet not found" });
    }
  }
};


