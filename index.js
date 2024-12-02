// const express = require('express');
// const morgan = require('morgan');
// const cors = require('cors');
// const connect = require("./db");
// require('dotenv').config();
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = process.env.PORT || 3002;


// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(morgan('tiny'));

// const routes = require('./routes/api');
// const routesGastos = require('./routes/routeGastos');
// const routeMascota = require('./routes/routeMascota');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/api', routes);
// app.use('/api', routesGastos);
// app.use('/api', routeMascota);

// app.listen(PORT, () => {
//     console.log(`Server is starting at ${PORT}`);
// });



const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connect = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

const routes = require("./routes/api");
const routesGastos = require("./routes/routeGastos");
const routeMascota = require("./routes/routeMascota");

connect;

// // Orígenes permitidos
const allowedOrigins = [
    "http://localhost:3000",
    "https://frontend-app-peluqueria.vercel.app", // Reemplaza esto con la URL de tu frontend en Vercel
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };
  
  app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));

app.use("/api", routes);
app.use("/api", routesGastos);
app.use("/api", routeMascota);

app.listen(PORT, () => {
  console.log(`Server is starting at ${PORT}`);
});