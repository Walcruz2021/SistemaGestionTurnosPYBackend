require('dotenv').config()
import express from "express"
import mongoose from "mongoose"


let connection

const{
    DB_USER,
    DB_PASSWORD
}=process.env

const mongoUrl=`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.b5p91.mongodb.net/BDAPlicacionMascotas?retryWrites=true&w=majority`


export const connectDB=mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

//useFindAndModify: false para solucionar 
// DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});


