import  Gastos from "../models/gastos.js";
import  Company  from "../models/company.js";

export const addGastos = async (req, res) => {
  const {
    año,
    date,
    description,
    efectivo,
    tarjeta,
    transferencia,
    categoryGasto,
    value,
    mes,
    typeGasto,
    idCompany,
  } = req.body;
  const gasto = new Gastos({
    año,
    date,
    description,
    efectivo,
    transferencia,
    tarjeta,
    categoryGasto,
    value,
    mes,
    typeGasto,
    idCompany,
  });
  const findCompany = await Company.find({ _id: idCompany });

  if (findCompany) {
    await gasto.save();
    res.status(200).json({
      status: "Gasto Agendado",
    });
  } else {
    res.status(204).json({
      msg: "company not found",
    });
  }
};

export const getGastosDirXanio = async (req, res) => {
  const { año } = req.body;
  const idCompany = req.params.idCompany;
  console.log(idCompany);
  const gastosFind = await Gastos.find({
    idCompany: idCompany,
    año: año,
    typeGasto: "Gasto Directo",
  });
  if (gastosFind.length) {
    res.status(200).json({
      gastosFind,
    });
  } else {
    res.status(204).json({
      msg: "gastos not found",
    });
  }
};

export const gtosXanio = async (req, res) => {
  const idCompany = req.params.idCompany;
  const { anio } = req.query;

  const gastos = await Gastos.find({ idCompany: idCompany, año: anio });
  console.log(gastos);
  if (gastos.length > 0) {
    res.status(200).json({
      gastos,
    });
  } else {
    res.status(204).json({
      msg: "gastos no encontrado",
    });
  }
};

export const getGastosIndXanio = async (req, res) => {
  const { año } = req.body;
  const idCompany = req.params.idCompany;
  console.log(idCompany);
  const gastosFind = await Gastos.find({
    idCompany: idCompany,
    año: año,
    typeGasto: "Gasto Indirecto",
  });
  if (gastosFind.length) {
    res.status(200).json({
      gastosFind,
    });
  } else {
    res.status(204).json({
      msg: "gastos not found",
    });
  }
};

export const gastosXanioandMesNow = async (req, res) => {
  let now = new Date();
  let mes = now.getMonth() + 1;
  let anio = now.getFullYear();

  const idCompany = req.params.idCompany;

  const gastos = await Gastos.find({
    idCompany: idCompany,
    mes: mes,
    año: anio,
  });

  try {
    if (gastos) {
      return res.status(200).json({
        gastos,
      });
    } else
      return res.status(204).json({
        msg: "no existen gastos",
      });
  } catch (error) {
    console.log(error);
  }
};

export const gastosXanioandMesParam = async (req, res) => {
  const { date } = req.query;

  let año = Math.trunc(date / 10);

  let mes = date % 10;

  const idCompany = req.params.idCompany;

  if (((Math.log(año) * Math.LOG10E + 1) | 0) > 4) {
    mes = "" + (año % 10) + mes;
    año = Math.trunc(año / 10);
  }

  const gtos = await Gastos.find({ idCompany: idCompany, mes: mes, año: año });
  if (gtos.length > 0) {
    return res.status(200).json({
      gtos,
    });
  } else
    return res.status(204).json({
      msg: "no existen gastos",
    });
};
