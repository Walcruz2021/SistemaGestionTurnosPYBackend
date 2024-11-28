const Cliente = require("../models/cliente");
const Perro = require("../models/perro");
const Venta = require("../models/venta");
const multer = require("multer");
const XLSX = require("xlsx");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

const searchClient = async (name) => {
  const client = await Cliente.findOne({ name: `${name}` });
  return client || null;
};

const searchallClients = async () => {
  //     const clients=await Cliente.find();
  // return clients?clients:null
  Cliente.find({}, function (err, clientes) {
    Perro.populate(clientes, { path: "perro" }, function (err, clientes) {
      res.status(200).send(clientes);
    });
  });
};

const listClients = async (req, res) => {
  try {
    if (req.params.id) {
      const idCompany = req.params.id;
      console.log(idCompany);
      await Cliente.find(
        { status: true, Company: idCompany },
        function (err, clientes) {
          Venta.populate(
            clientes,
            { path: "pedidos" },
            function (err, clientes) {}
          ),
            Perro.populate(
              clientes,
              { path: "perros" },
              function (err, clientes) {
                // res.status(200).send(clientes)

                return res.status(200).json({
                  clientes,
                });
              }
            );
        }
      );
    }
  } catch (err) {
    return err;
  }
};

const listClientId = async (req, res, next) => {
  if (req.params.id) {
    const buscado = await Cliente.findById(req.params.id);
    console.log(buscado);
    try {
      res.json({
        buscado,
      });
    } catch (error) {
      console.log(error);
    }

    return res.status(400);
  }
};

const addClient = async (req, res, next) => {
  try {
    const { name, phone, address, notesCli, status, Company,email } = req.body;
    const cliente = new Cliente({
      name,
      // nameDog:nameDog,
      phone,
      address,
      notesCli,
      status,
      Company,
      email
    });
    await cliente.save();
    res.json({
      status: "cliente guardado satisfactoriamente",
    });
  } catch (error) {
    console.log(error);
  }
};

const editClient = async (req, res) => {
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
};

const deleteClient = async (req, res) => {
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
};

const uploadClients = async (req, res) => {
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
    if (arrayDataFilter.length===data.length) {
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

module.exports = {
  searchClient,
  searchallClients,
  listClients,
  listClientId,
  addClient,
  editClient,
  deleteClient,
  uploadClients,
};
