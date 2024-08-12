const Cliente = require("../models/cliente");
const Perro = require("../models/perro");
const Venta = require("../models/venta");
const Company = require("../models/company");

const addVenta = async (req, res, next) => {
  //console.log(req.params.idClient);
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
    idCompany,
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
    idCompany,
  });
  try {
    const cliente = await Cliente.findById(req.params.idClient);
    // console.log(cliente,"---->")
    venta.client = cliente;
    const company = await Company.findById(req.body.idCompany);
    venta.idCompany = company;
    const dog = await Perro.findById(req.body.idDog);
    console.log(dog);
    venta.Dog = dog;
    await venta.save();
    //console.log(venta);
    cliente.pedidos.push(venta);
    await cliente.save();
    res.json({
      status: "Venta agendada",
    });
  } catch (err) {
    next(err);
  }
};

const listVentas = async (req, res) => {
  // si no coloco el async y el await se enviara a la consola respuestas antes
  // de terminar de hacer la bsusqueda por completo de la BD y tirara errores
  // busqueda de todos los registros que existen en la BD
  const ventas = await Venta.find();

  // res.send("hola mundo")
  res.json({
    ventas,
  });
};

const ventaXanio = async (req, res) => {
  const idCompany = req.params.idCompany;
  const { anio } = req.query;

  const ventas = await Venta.find({ idCompany: idCompany, año: anio });
  if (ventas.length > 0) {
    res.status(200).json({
      ventas,
    });
  } else {
    res.status(204).json({
      msg: "vta no encontrada",
    });
  }
};

const vtasxAnioandMesNow = async (req, res) => {
  let now = new Date();
  let mes = now.getMonth() + 1;
  let anio = now.getFullYear();

  const idCompany = req.params.idCompany;
  console.log(idCompany);
  const vtas = await Venta.find({
    idCompany: idCompany,
    mes: mes,
    año: anio,
  });

  try {
    if (vtas) {
      return res.status(200).json({
        vtas,
      });
    } else
      return res.status(204).json({
        msg: "no existen ventas",
      });
  } catch (error) {
    console.log(error);
  }
};

const vtasxAnioandMesParam = async (req, res) => {
  const { date } = req.body;

  let año = Math.trunc(date / 10);

  let mes = date % 10;

  console.log(date);
  const idCompany = req.params.idCompany;

  if (((Math.log(año) * Math.LOG10E + 1) | 0) > 4) {
    mes = "" + (año % 10) + mes;
    año = Math.trunc(año / 10);
  }

  const vtas = await Venta.find({ idCompany: idCompany, mes: mes, año: año });
  if (vtas.length > 0) {
    return res.status(200).json({
      vtas,
    });
  } else
    return res.status(204).json({
      msg: "no existen ventas",
    });
};

const listVentasxId = async (req, res, next) => {
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
};

const ventasxIdClient = async (req, res, next) => {
  // const perro=req.body
  // console.log(perro)
  // const {dog}=req.body
  const dog = req.params.idDog;

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
};

module.exports = {
  addVenta,
  listVentas,
  ventaXanio,
  vtasxAnioandMesNow,
  vtasxAnioandMesParam,
  listVentasxId,
  ventasxIdClient,
};
