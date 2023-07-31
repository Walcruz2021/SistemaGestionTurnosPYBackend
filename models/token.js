//ESTE MODELO PERMITIRA GUARDAR EL REFRESH-TOKEN EL CUAL PERMITIRA MANTENERSE LOGUEADO

const Mongoose = require("mongoose");

const TokenSchema = new Mongoose.Schema({
  id: { type: Object },
  token: { type: String, required: true },
});

module.exports = Mongoose.model("Token", TokenSchema);