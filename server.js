
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002; // Step 1
const connect=require("./db")
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
 
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

app.use(cors(corsOptions));

require('dotenv').config()

const routes = require('./routes/api');
const routesGastos=require('./routes/routeGastos')
const routeMascota=require('./routes/routeMascota')

connect

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//BODYPARSER middleware para analizar el cuerpo de la solicitud.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use('/api', routes);
app.use('/api',routesGastos)
app.use('/api',routeMascota)


app.listen(PORT, console.log(`Server is starting at ${PORT}`));
