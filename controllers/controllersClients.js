const Cliente = require('../models/cliente')
const Perro = require('../models/perro')
const Venta = require('../models/venta')

const searchClient = async (name) => {
  const client = await Cliente.findOne({ name: `${name}` })
  return client || null
}

const searchallClients = async () => {
//     const clients=await Cliente.find();
// return clients?clients:null
  Cliente.find({}, function (err, clientes) {
    Perro.populate(clientes, { path: 'perro' }, function (err, clientes) {
      res.status(200).send(clientes)
    })
  })
}

const listClients=async (req, res) => {
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
}

const listClientId=async (req, res, next) => {
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
}

const addClient=async (req, res, next) => {
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
}

const editClient=async (req, res) => {
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
}

const deleteClient= async (req, res) => {
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
}

module.exports = {
  searchClient,
  searchallClients,
  listClients,
  listClientId,
  addClient,
  editClient,
  deleteClient
}
