//ESTE MODELO PERMITIRA GUARDAR EL REFRESH-TOKEN EL CUAL PERMITIRA MANTENERSE LOGUEADO

const mongoose = require("mongoose");
const {Schema}=mongoose

const TokenSchema = new Schema({
  id: { type: Object },
  token: { type: String, required: true },
});

module.exports = mongoose.model("Token", TokenSchema);