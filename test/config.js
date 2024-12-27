import mongoose from "mongoose";
import app from "../index.js";

const { DB_USER, DB_PASSWORD, BDMASCOSTASPREPROD } = process.env;
let server;

export const configDatabase = async () => {
  const mongoUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.b5p91.mongodb.net/${BDMASCOSTASPREPROD}?retryWrites=true&w=majority`;
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
