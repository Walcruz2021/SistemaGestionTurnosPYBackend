
// import express from "express";
// import { startApolloServer } from "./server/app.js";
// import morgan from "morgan";
// import cors from "cors";
// import connectDB from "./db.js";
// const PORT = process.env.PORT || 3002;
// import routes from "./routes/api.js";
// import routesGastos from "./routes/routeGastos.js";
// import routeMascota from "./routes/routeGastos.js";
// import resolvers from "./server/graphql/resolvers.js";
// import routeClients from "./routes/routeClients.js"
// import typeDefs from "./server/graphql/typeDefs.js";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();


const PORT = process.env.PORT || 3002;

const routes = require("./routes/api");
const routesGastos = require("./routes/routeGastos");
const routeMascota = require("./routes/routeMascota");

//esto debe estar activado para que se ejecute la opcion de envio de notificaciones
//import alertScheduler from "././routes/alertScheduler.js"

connectDB;
const app = express();
startApolloServer(typeDefs, resolvers);
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
app.use("/api", routeClients);

app.listen(PORT, () => {
  console.log(`Server is starting at ${PORT}`);
});
