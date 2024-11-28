"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRolUserClient = exports.authRoutes = void 0;
const user_js_1 = __importDefault(require("../models/user.js"));
//const { body, validationResult } = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//const jwt = require("jsonwebtoken");
//const { JWT_SECRET } = process.env;
//const { tokenSign } = require("../helpers/generateTokens");
const cliente_js_1 = __importDefault(require("../models/cliente.js"));
//import getUserInfo from "../lib/getUserInfo.js";
//const jsonResponse = require("../lib/jsonResponse");
//el controlador authRoutes se encarga de manejar la autenticación de un usuario existente en la base de datos.
//Verifica si el correo electrónico y la contraseña proporcionados coinciden con los datos almacenados en la base de datos.
const authRoutes = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password)
        return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = await user_js_1.default.findOne({ userName: userName }).exec();
    if (!foundUser)
        return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcryptjs_1.default.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign({
            "UserInfo": {
                "userName": foundUser.userName,
                "roles": roles
            }
        }, "123456", { expiresIn: '10s' });
        const refreshToken = jwt.sign({ "userName": foundUser.userName }, "12345", { expiresIn: '1d' });
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);
        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        // Send authorization roles and access token to user
        res.json({ roles, accessToken });
    }
    else {
        res.sendStatus(401);
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
exports.authRoutes = authRoutes;
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
        let userDuplicate = await user_js_1.default.findOne({ email });
        if (userDuplicate) {
            return res
                .status(400)
                .json({ error: `El usuario ${userName} ya existe` });
        }
        // Crea un nuevo usuario
        const user = new user_js_1.default({
            email,
            password,
            idClient,
            role,
        });
        // Encripta la contraseña
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(password, salt);
        // Guarda el usuario en la base de datos
        await user.save();
        const newData = {
            email: email,
            userLogin: true,
        };
        await cliente_js_1.default.findByIdAndUpdate(idClient, newData, {
            userFindAndModify: false,
        });
        res.json({ message: `${email} creado exitosamente` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Error del servidor");
    }
};
exports.createUserRolUserClient = createUserRolUserClient;
