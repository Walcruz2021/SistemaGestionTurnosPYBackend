import Cliente from "../models/cliente.js";
import Perro from "../models/perro.js";
import Venta from "../models/venta.js";
import Company from "../models/company.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

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

  //const ventas = await Venta.find({ idCompany: idCompany, año: anio });
  const result = await Venta.aggregate([
    {

      $match: {
        idCompany: new mongoose.Types.ObjectId(idCompany),
        año: parseInt(anio),
      }
    },
    {

      $facet: {


        sumaByMes: [
          {

            $group: {
              _id: "$mes",//agrupa todos los elementos por mes, el _id es el campo por el cual se agrupa
              totalValorServ: { $sum: "$valorServ" },
              totalEfectivo: { $sum: "$efectivo" },
              totalTarjeta: { $sum: "$tarjeta" },
              totalTransferencia: { $sum: "$transferencia" },
              totalCantServicios: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 } // Ordena por mes de forma ascendente
          }
        ],

        sumaTotal: [
          {

            $group: {
              _id: null,//agrupa todos los elementos por mes, el _id es el campo por el cual se agrupa
              totalValorServ: { $sum: "$valorServ" },
              totalEfectivo: { $sum: "$efectivo" },
              totalTarjeta: { $sum: "$tarjeta" },
              totalTransferencia: { $sum: "$transferencia" },
              totalCantServicios: { $sum: 1 }
            }
          }
        ],


      }

    }

  ])

  const data = result[0];

  return res.status(200).json({
    totalByMonth: data.sumaByMes,
    totalByYear: data.sumaTotal[0] || {
      totalValorServ: 0,
      totalEfectivo: 0,
      totalTarjeta: 0,
      totalTransferencia: 0,
      totalCantServicios: 0
    }
  })


};

export const vtasxAnioandMesNow = async (req, res) => {
  let now = new Date();
  let mes = now.getMonth() + 1;
  let anio = now.getFullYear();

  const idCompany = req.params.idCompany;

  if (!idCompany || !mes || !anio) {
    return res.status(400).json({
      message: "Parámetros incompletos"
    });
  }

  try {
    const vtas = await Venta.find({
      idCompany: idCompany,
      mes: mes,
      año: anio,
    });


    return res.status(200).json({
      vtas: vtas,
    });

  } catch (error) {
    console.log(error);
  }
};

export const vtasxAnioandMesParam = async (req, res) => {


  const { date } = req.query;

  let str = date.toString();

  let año = parseInt(str.slice(0, 4));
  let mes = parseInt(str.slice(4));
  const idCompany = req.params.idCompany;

  if (((Math.log(año) * Math.LOG10E + 1) | 0) > 4) {
    mes = "" + (año % 10) + mes;
    año = Math.trunc(año / 10);
  }

  if (!idCompany || !mes || !año) {
    return res.status(400).json({
      message: "Parámetros incompletos"
    });
  }

  try {
    const vtas = await Venta.find({ idCompany: idCompany, mes: mes, año: año });

    return res.status(200).json({
      vtas: vtas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }

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

export const rankingVtasTotalByClient = async (req, res, next) => {
  const { idCompany } = req.params
  try {
    // 🔹 Conectarte a la base de datos

    // 🔹 Pipeline de agregación
    const ranking = await Venta.aggregate([
      { $match: { idCompany: new ObjectId(idCompany) } },
      {
        $lookup: {
          from: "clientes",
          localField: "client",
          foreignField: "_id",
          as: "cliente_data"
        }
      },
      { $unwind: "$cliente_data" },
      {
        $group: {
          _id: "$client",
          totalCantServicios: { $sum: 1 },
          totalValorServ: { $sum: "$valorServ" },
          nameClient: { $first: "$cliente_data.name" }
        }
      },
      { $sort: { totalCantServicios: -1 } },
      { $limit: 5 }
    ])

    // 🔹 Ejecutar la agregación
    //const ranking = await Venta.aggregate(pipeline).toArray();

    // 🔹 Responder


    return res.status(200).json({
      msg: "Suma Vtas por Clientes",
      ranking,
    });

  } catch (err) {
    console.error('Error al obtener ranking de clientes:', err);
    res.status(500).json({ error: 'Error al obtener ranking de clientes' });
  }
};

export const rankingVtasDetailsByClient = async (req, res, next) => {
  const { idCompany } = req.params

  try {
    // 🔹 Conectarte a la base de datos    const collection = db.collection('ventas'); // nombre exacto de tu colección

    // 🔹 Pipeline de agregación
    // const pipeline = [
    //   // 🔹 Filtrar por empresa
    //   { $match: { idCompany: new ObjectId(idCompany) } },

    //   // 🔹 Unir datos del cliente
    //   {
    //     $lookup: {
    //       from: "clientes",
    //       let: { clienteId: "$client" },
    //       pipeline: [
    //         { $match: { $expr: { $eq: ["$_id", "$$clienteId"] } } },
    //         { $match: { status: true } } // Solo clientes activos
    //       ],
    //       as: "cliente_data"
    //     }
    //   },
    //   { $unwind: "$cliente_data" },

    //   // 🔹 Ordenar ventas por fecha (de más reciente a más antigua)
    //   { $sort: { date: -1 } },

    //   // 🔹 Agrupar por cliente
    //   {
    //     $group: {
    //       _id: "$client",
    //       cliente_name: { $first: "$cliente_data.name" },
    //       sales: { $push: "$$ROOT" }, // Guardamos todas las ventas del cliente
    //       totalSales: { $sum: 1 },
    //       totalValorServ: { $sum: "$valorServ" }
    //     }
    //   },

    //   // 🔹 Dejar solo las últimas 5 ventas por cliente
    //   {
    //     $project: {
    //       cliente_name: 1,
    //       totalSalesCount: 1,
    //       totalValorServ: 1,
    //       lastFiveSales: { $slice: ["$sales.valorServ", 5] }
    //     }
    //   },

    //   // 🔹 Ordenar por mayor valor vendido
    //   { $sort: { totalValorServ: -1 } },

    //   // 🔹 Limitar a los 5 clientes con más valor de ventas
    //   { $limit: 5 }
    // ];
    const ranking = await Venta.aggregate([
      // 🔹 Filtrar por empresa
      { $match: { idCompany: new ObjectId(idCompany) } },

      // 🔹 Unir datos del cliente
      {
        $lookup: {
          from: "clientes",
          let: { clienteId: "$client" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$clienteId"] } } },
            { $match: { status: true } } // Solo clientes activos
          ],
          as: "cliente_data"
        }
      },
      { $unwind: "$cliente_data" },

      // ✅ Ordenar por fecha de venta (más reciente primero)
      { $sort: { date: -1 } },

      // 🔹 Agrupar por cliente
      {
        $group: {
          _id: "$client",
          cliente_name: { $first: "$cliente_data.name" },
          sales: { $push: "$$ROOT" }, // ventas ya vienen ordenadas por fecha
          totalSales: { $sum: 1 },
          totalValorServ: { $sum: "$valorServ" }
        }
      },

      // ✅ Solo las 5 ventas más recientes
      {
        $project: {
          cliente_name: 1,
          totalSalesCount: 1,
          totalValorServ: 1,
          lastFiveSales: { $slice: ["$sales.valorServ", 5] } // tomamos las primeras 5 (ya ordenadas)
        }
      },

      // 🔹 Ordenar clientes por mayor valor vendido
      { $sort: { totalValorServ: -1 } },

      // 🔹 Limitar a los 5 mejores clientes
      { $limit: 5 }
    ]);

    // 🔹 Ejecutar la agregación
    // const ranking = await collection.aggregate(pipeline).toArray();

    return res.status(200).json({
      msg: "List Sales By Clients Details",
      ranking,
    });

  } catch (err) {
    console.error('Error al obtener ranking de clientes:', err);
    res.status(500).json({ error: 'Error al obtener ranking de clientes' });
  }
};