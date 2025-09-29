// libreria que nos permitira conectarse a mongodb
import mongoose from "mongoose";
const { Schema } = mongoose;

const turnoSchema = new Schema(
  {
    name: { type: String, require: true },
    nameDog: { type: String, require: true },
    // idDog: { type: String, require: true },
    idDog: { type: Schema.Types.ObjectId, ref: "Perro" },
    email: { type: String, require: false },
    phone: { type: Number, require: true },
    date: { type: String, require: true },
    notesTurn: { type: String, require: true },
    receta: { type: String, required: false },
    tratamiento: { type: String, required: false },
    vacunas: { type: String, required: false },
    peso: { type: Number, required: false },
    //statusFile es el que determina si el cliente o paciente cargo ficha o no
    statusFile: { type: Boolean, default: false },
    time: { type: String, require: true },
    //(sellers)nombre de campo el cual contendra no solo el id del cliente sino ademas todos
    //los datos del mismo(pedidos,turnos,etc)
    Client: {
      type: Schema.Types.ObjectId,
      ref: "Cliente",
    },
    Company: { type: Schema.Types.ObjectId, ref: "Company" },
    alertSent: { type: Boolean, default: false },
    isNotifications: { type: Boolean, default: false }, //permite saber si se le  enviara notificacion o no
    sendNotifications: { type: Boolean, default: false },
    category: { type: String,required:false }
  },
  { timestamps: true }
);

const Turno = mongoose.model("Turno", turnoSchema);
export default Turno;
