// libreria que nos permitira conectarse a mongodb
const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  phone: { type: Number, require: true },
  date: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  role:{type: String}
})

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('UserAdmin', userSchema)
