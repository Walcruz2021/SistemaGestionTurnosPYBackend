
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002; // Step 1
const connect=require("./db")
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
 

require('dotenv').config()

const routes = require('./routes/api');


connect
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//BODYPARSER middleware para analizar el cuerpo de la solicitud.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('tiny'));


app.use('/api', routes);


app.listen(PORT, console.log(`Server is starting at ${PORT}`));
