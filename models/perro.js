import mongoose from 'mongoose'
const { Schema } = mongoose

// La propiedad required permite indicar si un campo es obligatorio true o no false. Si se intenta
// realizar un registro nuevo y alguno de los campos requeridos falta, automáticamente se va a impedir
// guardar dichos datos y nos mostraría un error indicando que dicha propiedad es requerida.

export const perroShema = new Schema({
  raza: { type: String, require: true },
  tamaño: { type: String, require: true },
  nameDog: { type: String, require: true },
  notaP: { type: String, require: true },
  status:{type:Boolean,deafult:true}
})

const Perro=mongoose.model('Perro', perroShema)
export default Perro
