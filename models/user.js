// libreria que nos permitira conectarse a mongodb
const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  phone: { type: Number, require: true },
  date: { type: String, require: true },
  userName: { type: String, require: true },
  password: { type: String, require: true },
  roles:{ UserClient: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number},
  arrayBreaks: [{ type: Schema.Types.ObjectId, ref: 'Break' }],
  idClient:{type:Schema.Types.ObjectId,ref:'Cliente'}
})

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('UserAdmin', userSchema)
