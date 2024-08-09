
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connect=require("./db")
require('dotenv').config()
const bodyParser = require('body-parser');
 
//new changes
/////////////////////////////////////////////
//CORS: la respuesta a la solicitud de verificación previa no pasa la verificación de control de acceso: 
//El valor del encabezado 'Access-Control-Allow-Origin' en la respuesta no debe ser el comodín '*' cuando el modo 
//de credenciales de la solicitud es 'incluir'. El modo de credenciales de las solicitudes iniciadas por 
//XMLHttpRequest está controlado por el atributo withCredentials.A continuacion esta configuracion solucionaria 
//dicho error

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};
const app = express();
const PORT = process.env.PORT || 3002; // Step 1
const routes = require('./routes/api');
connect
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));

const routesGastos=require('./routes/routeGastos')
const routeMascota=require('./routes/routeMascota')

//BODYPARSER middleware para analizar el cuerpo de la solicitud.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);
app.use('/api',routesGastos)
app.use('/api',routeMascota)


app.listen(PORT, console.log(`Server is starting at ${PORT}`));
