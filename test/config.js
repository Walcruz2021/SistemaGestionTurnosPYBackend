import mongoose from "mongoose";
import app from "../index.js";

const { DB_USER, DB_PASSWORD, BDMASCOSTASPROD,BDMASCOSTASPREPROD } = process.env;
let server;

export const configDatabase = async () => {
const mongoUrl = `mongodb://walter:83367585walter@cluster0-shard-00-00.b5p91.mongodb.net:27017,cluster0-shard-00-01.b5p91.mongodb.net:27017,cluster0-shard-00-02.b5p91.mongodb.net:27017/${BDMASCOSTASPROD}?ssl=true&replicaSet=atlas-rjqw2o-shard-0&authSource=admin&appName=Cluster0`;
  await mongoose.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  if (!server) {
    server = app.listen(0, () => console.log("Server started for testing")); // Usa el puerto dinámico
  }
};

export const cleanUp = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null; // Asegúrate de limpiar la referencia
  }
};
