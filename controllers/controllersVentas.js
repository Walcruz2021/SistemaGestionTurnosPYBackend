import Cliente from "../models/cliente.js";
import Perro from "../models/perro.js";
import Venta from "../models/venta.js";
import Company from "../models/company.js";

export const addVenta = async (req, res, next) => {
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
    category,
    receta,
    tratamiento,
    vacunas,
    peso,
    idDog,
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
    receta,
    tratamiento,
    vacunas,
    peso,
    idDog,
  });
  try {
    const cliente = await Cliente.findById(req.params.idClient);
    venta.client = cliente;
    const company = await Company.findById(req.body.idCompany);
    venta.idCompany = company;

    //si llega idDog es porque se ingreso desde una peluqueria o veterinaria
    if (idDog) {
      const dog = await Perro.findById(req.body.idDog);
      venta.Dog = dog;
    }

    await venta.save();
    cliente.pedidos.push(venta);
    await cliente.save();
    res.json({
      status: "Venta agendada",
    });
  } catch (err) {
    next(err);
  }
};

export const listVentas = async (req, res) => {
  // si no coloco el async y el await se enviara a la consola respuestas antes
  // de terminar de hacer la bsusqueda por completo de la BD y tirara errores
  // busqueda de todos los registros que existen en la BD
  const ventas = await Venta.find();
  ventas.length
    ? res.status(200).json({
        ventas,
      })
    : res.status(404).json({
        message: "Ventas not found",
      });
};

export const ventaXanio = async (req, res) => {
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

export const vtasxAnioandMesNow = async (req, res) => {
  let now = new Date();
  let mes = now.getMonth() + 1;
  let anio = now.getFullYear();

  const idCompany = req.params.idCompany;

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

export const vtasxAnioandMesParam = async (req, res) => {
  const { date } = req.query;

  let año = Math.trunc(date / 10);

  let mes = date % 10;

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

export const listVentasxId = async (req, res, next) => {
  const { idVta } = req.params;
  const ventaID = await Venta.findById({ _id: idVta });
  // res.json(buscado)
  try {
    if (ventaID) {
      res.status(200).json({
        ventaID,
      });
    } else {
      res.status(204).json({
        msg: "venta not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const ventasxIdDog = async (req, res, next) => {
  const dog = req.params.idDog;

  const vta = await Venta.find({ Dog: dog }).populate("Dog").exec();
  if (vta.length > 0) {
    res.status(200).json({
      vta,
    });
  } else
    res.status(204).json({
      msg: "no existe dog",
    });
};

export const ventasxIdCli = async (req, res, next) => {
  const idCli = req.params.idCli;

  const vta = await Venta.find({ client: idCli });
  if (vta.length > 0) {
    res.status(200).json({
      vta,
    });
  } else
    res.status(204).json({
      msg: "no existe dog",
    });
};
