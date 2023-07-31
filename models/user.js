// libreria que nos permitira conectarse a mongodb
const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require("../auth/sign");
const getUserInfo = require("../lib/getUserInfo");
const Token = require("./token");

const userSchema = new Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  phone: { type: Number, required: false },
  date: { type: String, required: false },
  email: { type: String, required: true,unique:true},
  password: { type: String, required: true },
  roles:{ Admin: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        User: Number},
  arrayBreaks: [{ type: Schema.Types.ObjectId, ref: 'Break' }],
  idClient:{type:Schema.Types.ObjectId,ref:'Cliente'}
})

userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    const document = this;

    bcrypt.hash(document.password, 10, (err, hash) => {
      if (err) {
        next(err);
      } else {
        document.password = hash;
        next();
      }
    });
  } else {
    next();
  }
});

// userSchema.methods.comparePassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };

userSchema.methods.isCorrectPassword = async function (password, hash) {
  console.log(password, hash);
  const same = await bcrypt.compare(password, hash);

  return same;
};

//VERIFICA SI YA EXISTE UN EMAIL DE ALGUN OTRO USUARIO IGUAL AL QUE SE PASA POR PARAMETRO
userSchema.methods.emailExists = async function (email) {
  const result = await mongoose.model("User").find({ email: email });
  return result.length > 0;
};

userSchema.methods.createAccessToken = function () {
  return generateAccessToken(getUserInfo(this));
};

userSchema.methods.createRefreshToken = async function (next) {
  const refreshToken = generateRefreshToken(getUserInfo(this));

  console.error("refreshToken", refreshToken);

  try {
    await new Token({ token: refreshToken }).save();
    console.log("Token saved", refreshToken);
    return refreshToken;
  } catch (error) {
    console.error(error);
    //next(new Error("Error creating token"));
  }
};

module.exports = mongoose.model('User', userSchema)
