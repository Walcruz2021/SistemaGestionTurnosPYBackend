
import mongoose from 'mongoose';
import dotenv from 'dotenv';

let connection
dotenv.config(); // Carga las variables del archivo .env
const {DB_USER,DB_PASSWORD,BDMASCOSTASPROD,BDMASCOSTASPREPROD} =process.env



//const mongoUrl=`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.b5p91.mongodb.net/${BDMASCOSTASPROD}?retryWrites=true&w=majority`

const mongoUrl = `mongodb://${DB_USER}:${DB_PASSWORD}@cluster0-shard-00-00.b5p91.mongodb.net:27017,cluster0-shard-00-01.b5p91.mongodb.net:27017,cluster0-shard-00-02.b5p91.mongodb.net:27017/${BDMASCOSTASPROD}?ssl=true&replicaSet=atlas-rjqw2o-shard-0&authSource=admin&appName=Cluster0`;
console.log("URL usada:", mongoUrl);
const connectDB = mongoose.connect(mongoUrl, {
  useUnifiedTopology: true, // Solo esta opción es necesaria
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});



export default connectDB;
