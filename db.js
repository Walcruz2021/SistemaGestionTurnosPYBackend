
import mongoose from 'mongoose';
import dotenv from 'dotenv';

let connection
dotenv.config(); // Carga las variables del archivo .env
const {DB_USER,DB_PASSWORD,BDMASCOSTASPREPROD} =process.env



const mongoUrl=`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.b5p91.mongodb.net/${BDMASCOSTASPREPROD}?retryWrites=true&w=majority`

const connectDB = mongoose.connect(mongoUrl, {

  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//useFindAndModify: false para solucionar
// DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

export default connectDB;
