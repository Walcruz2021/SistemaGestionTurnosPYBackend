import express from "express";
import { startApolloServer } from "./server/app.js";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./db.js";
const PORT = process.env.PORT || 3002;
import routeTurns from "./routes/routeTurns.js";
import routesGastos from "./routes/routeGastos.js";
import routeMascota from "./routes/routeMascota.js";
import routeClients from "./routes/routeClients.js";
import routeVentas from "./routes/routeVentas.js";
import routeUser from "./routes/routeUser.js";
import routeCompany from "./routes/routeCompany.js"
import alertConection from "./routes/alertConection.js"
import resolvers from "./server/graphql/resolvers.js";
import typeDefs from "./server/graphql/typeDefs.js";
import "./routes/alertScheduler.js";
// const resolvers=require("./graphql/resolvers")
// const typeDefs=require("./graphql/typeDefs")
connectDB;
const app = express();
//startApolloServer(typeDefs, resolvers);
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

app.use("/api",alertConection)
app.use("/api", routeTurns);
app.use("/api", routesGastos);
app.use("/api", routeMascota);
app.use("/api", routeClients);
app.use("/api", routeVentas);
app.use("/api", routeCompany)
app.use("/api", routeUser);



if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
}



export default app;
