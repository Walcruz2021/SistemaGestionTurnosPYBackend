const Cliente = require('../models/cliente')
const Perro = require('../models/perro')
const Venta = require('../models/venta')

const addVenta=async (req, res, next) => {
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
  }

  const listVentas=async (req, res) => {
    // si no coloco el async y el await se enviara a la consola respuestas antes
    // de terminar de hacer la bsusqueda por completo de la BD y tirara errores
    // busqueda de todos los registros que existen en la BD
    const ventas = await Venta.find();
  
    // res.send("hola mundo")
    res.json({
      ventas,
    });
  }

  const ventaXanio= async (req, res) => {
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
  }

  const vtasxAnioandMesNow=async (req, res) => {
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
  }

  const vtasxAnioandMesParam=async (req, res) => {
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
  }

  const listVentasxId=async (req, res, next) => {
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
  }

  const ventasxIdClient=async (req, res, next) => {
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
  }

  module.exports={
    addVenta,
    listVentas,
    ventaXanio,
    vtasxAnioandMesNow,
    vtasxAnioandMesParam,
    listVentasxId,
    ventasxIdClient
  }