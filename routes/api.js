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
const { searchClient, searchallClients } = require("../controllers/clients.js");
const perro = require("../models/perro");
const { findByIdAndUpdate } = require("../models/users");

router.get("/listClients", async (req, res) => {
  try {
    await Cliente.find({status:true}, function (err, clientes) {
      Venta.populate(
        clientes,
        { path: "pedidos" },
        function (err, clientes) {}
      ),
        Perro.populate(clientes, { path: "perros" }, function (err, clientes) {
          // res.status(200).send(clientes)
          
            return res.status(200).json({
              clientes,
            });
          
        });
    });
  } catch (err) {
    return err;
  }
});

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

router.get("/listClients/:id", async (req, res, next) => {
  if (req.params.id) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const buscado = await Cliente.findById(req.params.id);
      console.log(buscado);
      try {
        res.json({
          buscado,
        });
      } catch (error) {
        console.log(error);
      }
    }
    return res.status(400);
  }
});

router.post("/client", async (req, res, next) => {
  const { name, phone, address, notesCli ,status} = req.body;
  const cliente = new Cliente({
    name,
    // nameDog:nameDog,
    phone,
    address,
    notesCli,
    status
  });
  await cliente.save();
  res.json({
    status: "cliente guardado satisfactoriamente",
  });
});

router.post("/addVentas/:idClient", async (req, res, next) => {
  console.log(req.params.idClient);
  const {
    date,
    valorServ,
    name,
    idTurno,
    notesTurn,
    tipoServ,
    transferencia,
    efectivo,
    tarjeta,
    año,
    mes,
  } = req.body;
  const venta = new Venta({
    idTurno,
    date,
    valorServ,
    name,
    notesTurn,
    tipoServ,
    transferencia,
    efectivo,
    tarjeta,
    año,
    mes,
  });
  try {
    const cliente = await Cliente.findById(req.params.idClient);
    // console.log(cliente,"---->")
    venta.client = cliente;
    const dog = await Perro.findById(req.body.idDog);
    console.log(dog);
    venta.Dog = dog;
    await venta.save();
    console.log(venta);
    cliente.pedidos.push(venta);
    await cliente.save();
    res.json({
      status: "Venta agendada",
    });
  } catch (err) {
    next(err);
  }
});

router.get("/listVentas", async (req, res) => {
  // si no coloco el async y el await se enviara a la consola respuestas antes
  // de terminar de hacer la bsusqueda por completo de la BD y tirara errores
  // busqueda de todos los registros que existen en la BD
  const ventas = await Venta.find();

  // res.send("hola mundo")
  res.json({
    ventas,
  });
});

// recibira idclient y buscara en la coleccion de ventas, las que tengan incorporados el idClient
router.get("/ventaCli/:idDog", async (req, res, next) => {
  // const perro=req.body
  // console.log(perro)
  // const {dog}=req.body
  const dog = req.params.idDog;
  console.log(dog);
  await Venta.find({ Dog: dog }, function (err, vta) {
    Perro.populate(vta, { path: "Dog" }, function (err, vta) {
      if (vta.length > 0) {
        res.status(200).json({
          vta,
        });
      } else
        res.status(204).json({
          msg: "no existe dog",
        });
    });
  });
});

router.get("/ventasxAnio/:anio", async (req, res) => {
  const vtaFind=req.params.anio
  console.log(vtaFind)
  const ventas = await Venta.find({ año: vtaFind });

  if (ventas.length > 0) {
    res.status(200).json({
      ventas
    });
  } else {
    res.status(204).json({
      msg: "vta no encontrada",
    });
  }
});

router.get("/vtasxAnioandMesNow", async (req, res) => {
  let now = new Date();
  let mes = now.getMonth() + 1;
  let anio = now.getFullYear();

  const vtas = await Venta.find({ mes: mes, año: anio });
  if (vtas.length > 0) {
    return res.status(200).json({
      vtas,
    });
  } else
    return res.status(204).json({
      msg: "no existen ventas",
    });
});

router.get("/vtasxAnioandMesParam/:date", async (req, res) => {
  //console.log(req.params.date)
  let año = Math.trunc(req.params.date / 10);
  let mes = req.params.date % 10;

  if (((Math.log(año) * Math.LOG10E + 1) | 0) > 4) {
    mes = "" + (año % 10) + mes;
    año = Math.trunc(año / 10);
  }

  const vtas = await Venta.find({ mes: mes, año: año });
  if (vtas.length > 0) {
    return res.status(200).json({
      vtas,
    });
  } else
    return res.status(204).json({
      msg: "no existen ventas",
    });
});

router.get("/listVentas/:id", async (req, res, next) => {
  // mongoose.Types.ObjectId.isValid(req.params) para resolver
  // CastError: Cast to ObjectId failed for value "{ _id: '[object Object]' }" (type Object) at path "_id" for model "Venta"
  // se valida si el valor del criterio para la búsqueda es un ObjectId válido

  const ventaID = await Venta.findById(req.params.id);
  // res.json(buscado)
  try {
    if (ventaID) {
      res.status(200).json({
        ventaID,
      });
    }
    res.status(204).json({
      status: "venta no encontrada",
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getTurnos", async (req, res) => {
  // si no coloco el async y el await se enviara a la consola respuestas antes
  // de terminar de hacer la bsusqueda por completo de la BD y tirara errores
  // busqueda de todos los registros que existen en la BD
  const turnos = await Turno.find();
  console.log("turnos");
  // res.send("hola mundo")

  res.json({
    turnos,
  });
});

router.post("/turno", async (req, res, next) => {
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
});

/// ////////////////////////PERROS//////////////////////////////

router.post("/addPerro/:id", async (req, res, next) => {
  const { nameDog, raza, tamaño, notaP,status} = req.body;
  const perro = new Perro({
    nameDog,
    raza,
    tamaño,
    notaP,
    status
  });
  try {
    const cliente = await Cliente.findById(req.params.id);
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
});

router.get("/perro/:id", async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const buscado = await Perro.findById(req.params.id);
    // res.json(buscado)
    res.send(buscado);
    // res.json({
    //   status: "venta encontrada"
    // })
  }
});

router.delete("/deleteTurno/:id", async (req, res) => {
  await Turno.findByIdAndRemove(req.params.id, { userFindAndModify: false })
    .then(() =>
      res.json({
        status: "TURNO ELIMINADO",
      })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

router.delete("/deleteClient/:id", async (req, res) => {
  // await Cliente.findByIdAndRemove(req.params.id, { userFindAndModify: false });

  const newStatus = {
    status: false,
  };

  await Cliente.findByIdAndUpdate(req.params.id, newStatus, {
    userFindAndModify: false,
  })
    .then(() =>
      res.json({
        status: "CLENTE  ELIMINADO",
      })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/deleteDog/:idDog", async (req, res) => {
  
  console.log(req.params.idDog)
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
  .catch((err)=>res.status(400).json("Error:" + err));
});

// modificacmos un turno que ya existe
router.put("/editTurno/:id", async (req, res) => {
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
});

// modificacmos un cliente que ya existe
router.put("/editClient/:id", async (req, res) => {
  const { name, phone, address, notesCli } = req.body;
  const newClient = {
    name,
    phone,
    address,
    notesCli,
  };
  await Cliente.findByIdAndUpdate(req.params.id, newClient, {
    userFindAndModify: false,
  });
  res.json({
    status: "cliente actualizado",
  });
});


router.put("/editDog/:id",async (req,res)=>{
const idDog=req.params.id
const {nameDog,notaP,raza,tamaño}=req.body
const newDog={
  nameDog,
  notaP,
  raza,
  tamaño
}
await Perro.findByIdAndUpdate(idDog,newDog,{
  userFindAndModify: true,
})

res.status(200).json({
  msg:"mascota actualizada"
})
})

module.exports = router;
