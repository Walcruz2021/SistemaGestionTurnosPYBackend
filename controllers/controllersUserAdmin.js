const User = require("../models/user");
//const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
//const { JWT_SECRET } = process.env;
//const { tokenSign } = require("../helpers/generateTokens");
const Client = require("../models/cliente");
const getUserInfo = require("../lib/getUserInfo");
const jsonResponse = require("../lib/jsonResponse");

//el controlador authRoutes se encarga de manejar la autenticación de un usuario existente en la base de datos.
//Verifica si el correo electrónico y la contraseña proporcionados coinciden con los datos almacenados en la base de datos.

const authRoutes = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email and password are required." });

  try {
    let user = new User();
    const userExists = await user.emailExists(email);

    if (userExists) {
      user = await User.findOne({ email: email });

      const passwordCorrect = await user.isCorrectPassword(
        password,
        user.password
      );

      if (passwordCorrect) {
        const accessToken = user.createAccessToken();
        const refreshToken = await user.createRefreshToken();

        console.log({ accessToken, refreshToken });

        return res.json(
          jsonResponse(200, {
            accessToken,
            refreshToken,
            user: getUserInfo(user),
          })
        );
      } else {
        //res.status(401).json({ error: "username and/or password incorrect" });

        return res.status(401).json(
          jsonResponse(401, {
            error: "email and/or password incorrect",
          })
        );
      }
    } else {
      return res.status(401).json(
        jsonResponse(401, {
          error: "email does not exist",
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
  // const foundUser = await User.findOne({ email: email }).exec();
  // if (!foundUser) return res.sendStatus(401); //Unauthorized
  // // evaluate password
  // const match = await bcrypt.compare(password, foundUser.password);
  // if (match) {
  //   const roles = Object.values(foundUser.roles).filter(Boolean);
  //   // create JWTs
  //   const accessToken = jwt.sign(
  //     {
  //       UserInfo: {
  //         email: foundUser.email,
  //         roles: roles,
  //       },
  //     },
  //     "123456",
  //     { expiresIn: "10s" }
  //   );

  //   //refreshToken permite generar un nuevo token
  //   const refreshToken = jwt.sign({ email: foundUser.email }, "12345", {
  //     expiresIn: "1d",
  //   });
  //   // Saving refreshToken with current user
  //   foundUser.refreshToken = refreshToken;
  //   const result = await foundUser.save();

  //   // Creates Secure Cookie with refresh token
  //   res.cookie("jwt", refreshToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "None",
  //     maxAge: 24 * 60 * 60 * 1000,
  //   });

  //   // Send authorization roles and access token to user
  //   res.json({
  //     roles,
  //     accessToken,
  //     refreshToken,
  //     user: getUserInfo(foundUser),
  //   });
  // } else {
  //   res.sendStatus(401);
  // }
};

const createUserRolUserClient = async (req, res) => {
  // Verifica si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role, idClient } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email and Passsword are required" });

  try {
    // Verifica si el usuario ya existe en la base de datos
    let userDuplicate = await User.findOne({ email });
    if (userDuplicate) {
      return res.status(400).json({ error: `El usuario ${email} ya existe` });
    }

    // Crea un nuevo usuario
    const user = new User({
      email,
      password,
      idClient,
      role,
    });

    // Encripta la contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Guarda el usuario en la base de datos
    await user.save();

    const newData = {
      email: email,
      userLogin: true,
    };

    await Client.findByIdAndUpdate(idClient, newData, {
      userFindAndModify: false,
    });

    res.json({ message: `${email} creado exitosamente` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error del servidor");
  }
};

module.exports = {
  authRoutes,
  createUserRolUserClient,
};
