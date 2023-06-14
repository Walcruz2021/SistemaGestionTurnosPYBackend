const User=require('../models/user')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const{
  JWT_SECRET
}=process.env
const {tokenSign}=require("../helpers/generateTokens")

//el controlador authRoutes se encarga de manejar la autenticación de un usuario existente en la base de datos. 
//Verifica si el correo electrónico y la contraseña proporcionados coinciden con los datos almacenados en la base de datos.

const authRoutes= async (req, res) => {
    //Verifica si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password, role} = req.body;

    try {
      // Verifica si el usuario existe en la base de datos
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Credenciales inválidas' });
      }
      
      //Verifica si la contraseña es correcta
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Credenciales inválidas' });
      }
  
      // // Crea y firma el token JWT
      const payload = {
        user: {
          id: user.id,
          role:user.role
        }
      };
  
      //JWT_SECRET es la llave que tenemos para verificar si el token generado es uno que genero yo o de lo contrario es uno generado por alguien
      //que quiera insertar un clave agena

      const tokenSession=await tokenSign(payload.user)
      res.json({ data:user,tokenSession:tokenSession });

    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error del servidor');
    }
  }

  const createUser = async (req, res) => {
    // Verifica si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password,role } = req.body;
  
    try {
      // Verifica si el usuario ya existe en la base de datos
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }
  
      // Crea un nuevo usuario
      user = new User({
        email,
        password,
        role
      });
  
      // Encripta la contraseña
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      // Guarda el usuario en la base de datos
      await user.save();
  
      res.json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error del servidor');
    }
  };
  
  module.exports={
    authRoutes,
    createUser
  }