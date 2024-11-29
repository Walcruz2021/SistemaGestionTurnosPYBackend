require('dotenv').config();
const mongoose = require('mongoose');

const { DB_USER, DB_PASSWORD } = process.env;

const mongoUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.b5p91.mongodb.net/BDAPlicacionMascotas?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, // ya no es necesario si estás usando mongoose >= 6.x
    });
    console.log('Mongoose is connected!!!!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Termina la aplicación si falla la conexión.
  }
};

// Manejo de eventos
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected');
});

module.exports = connectDB;
