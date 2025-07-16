import server from "react-prime/lib/server.js";
import Cliente from "../models/cliente.js";
import Perro from "../models/perro.js";
import Venta from "../models/venta.js";
import Turno from "../models/turno.js";

//postman OK
//graphQL OK
export const listClients = async (req, res) => {
  try {
    const { idCompany } = req.params;

    if (!idCompany) {
      return res
        .status(400)
        .json({ message: "ID de la compañía es requerido" });
    }

    // Buscar clientes con la compañía y estado activos
    let clientes = await Cliente.find({
      status: true,
      Company: idCompany,
    }).exec();

    if (clientes.length > 0) {
      // Población de pedidos y perros
      clientes = await Cliente.populate(clientes, { path: "pedidos" });
      clientes = await Perro.populate(clientes, { path: "perros" });

      return res.status(200).json({ clientes });
    } else {
      return res.status(204).json({ message: "Clients not found" });
    }
  } catch (err) {
    console.error("Error al listar los clientes:", err);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: err.message });
  }
};

//postman OK
//graphQL OK
export const listClientId = async (req, res, next) => {
  const { idClient } = req.params;
console.log(idClient)
  const findClient = await Cliente.findById(idClient);
  try {
    if (findClient) {
      res.status(200).json({
        findClient,
      });
    } else {
      res.status(404).json({
        msg: "clients not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const addClient = async (req, res, next) => {
  try {
    const { name, phone, address, notesCli, status, Company, email } = req.body;
    const cliente = new Cliente({
      name,
      // nameDog:nameDog,
      phone,
      address,
      notesCli,
      status,
      Company,
      email,
    });
    await cliente.save();
    res.json({
      status: "cliente guardado satisfactoriamente",
    });
  } catch (error) {
    console.log(error);
  }
};

export const editClient = async (req, res) => {
  const { name, phone, address, notesCli, email } = req.body;

  const newClient = {
    name,
    phone,
    address,
    notesCli,
    email,
  };

  const { idClient } = req.params;

  const findClient = await Cliente.findByIdAndUpdate(idClient, newClient, {
    useFindAndModify: false,
  });


  if (findClient) {
    if(findClient.turnos.length){

      for(let turn of findClient.turnos){
        const turno=await Turno.findOne({_id : turn})
console.log(turno)
        if(turn){
          await Turno.findByIdAndUpdate(turn,{email,phone},{
            useFindAndModify: false
          })
        }
      }
    }
    res.status(200).json({
      status: "client updated",
    });
  } else {
    res.status(400).json({
      msg: "Client not found",
    });
  }
};

//eliminar un cliente implica primero verificar que dicho Id no este ligado a las colecciones
//ventas y turnos

export const deleteClient = async (req, res) => {
  // await Cliente.findByIdAndRemove(req.params.id, { userFindAndModify: false });

  const newStatus = {
    status: false,
  };
  const { idClient } = req.params;
  const turns = await Turno.findOne({ Client: idClient });
  //const ventas=await Venta.findOne({client:idClient})
  if (turns) {
    res.status(204).json({
      msg: "turnos existentes",
    });
  } else {
    await Cliente.findByIdAndUpdate(idClient, newStatus, {
      userFindAndModify: false,
    })
      .then(() =>
        res.json({
          status: "CLIENT DELETED",
        })
      )
      .catch((err) => res.status(400).json("Error: " + err));
  }
};

export const uploadClients = async (req, res) => {
  //isNaN(valor) false si el valor es un número o puede ser convertido a un número
  //isNaN(true) por ejempo true puede convertirse a 1

  function isNumber(valor) {
    return typeof valor === "number" && !isNaN(valor);
  }

  function isString(valor) {
    return typeof valor === "string" && valor.trim().length > 0;
  }

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send("No se ha proporcionado ningún archivo.");
    }

    // Leer el archivo Excel
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convertir a formato JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    //validation data with format Model
    const arrayDataFilter = data.filter((data) => {
      // this code verify if exist field and data - no son null, undefined, 0, false, o una cadena vacía ""
      return (
        data.name &&
        isString(data.name) &&
        isNumber(data.phone) &&
        data.phone &&
        data.address &&
        isString(data.address)
      );
      // typeof data.name === "string" &&
      // data.name.trim() !== "" &&
      //   typeof data.phone === "string" &&
      //   data.phone.trim() !== "" &&
      //   typeof data.address === "string" &&
      //   data.address.trim() !== "";
    });

    // Guardar cada entrada en la base de datos
    //console.log(arrayDataFilter)
    if (arrayDataFilter.length === data.length) {
      //console.log(arrayDataFilter)
      await Promise.all(
        arrayDataFilter.map(async (entry) => {
          const newClient = new Cliente(entry);
          await newClient.save();
        })
      );

      res.send("Archivo subido y datos guardados en la base de datos.");
      // arrayDataFilter.forEach(async (entry) => {
      //   const newClient = new Cliente(entry);
      //   await newClient.save();
      // });
    } else {
      res.status(400).send("Revise su Archivo");
    }
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).send("Hubo un error al procesar el archivo.");
  }
};
