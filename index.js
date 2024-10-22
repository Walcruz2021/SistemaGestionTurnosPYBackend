

import express from "express"
import {startApolloServer} from "./app.js"
import morgan from "morgan"
import cors from "cors"
import connectDB from "./db.js"
//import app from "express"
//const app = express();
const PORT = process.env.PORT || 3002;
import routes from "./routes/api.js"
import routesGastos from "./routes/routeGastos.js"
import routeMascota from "./routes/routeGastos.js"
// const routesGastos = require("./routes/routeGastos");
// const routeMascota = require("./routes/routeMascota");
import resolvers from "./graphql/resolvers.js"
import typeDefs from "./graphql/typeDefs.js"
// const resolvers=require("./graphql/resolvers")
// const typeDefs=require("./graphql/typeDefs")
connectDB;
const app=express()
startApolloServer(typeDefs,resolvers)
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
