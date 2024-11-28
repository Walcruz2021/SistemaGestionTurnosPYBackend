"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.validationCompanyExist = exports.addUser = void 0;
const user_js_1 = __importDefault(require("../models/user.js"));
//graphQL OK
//postman OK
const addUser = async (req, res) => {
    const { fullName, status, email } = req.body;
    const newUser = new user_js_1.default({
        fullName,
        status,
        email,
    });
    console.log(newUser);
    const findUser = await user_js_1.default.findOne({ email: email });
    if (!findUser) {
        console.log("user NO se encontro");
        await newUser.save();
        return res.status(200).json({
            msg: "user add correctly",
            newUser,
        });
    }
    else {
        return res.status(204).json({
            msg: "user NOT added",
        });
    }
};
exports.addUser = addUser;
//postman OK graphQl ok
const validationCompanyExist = async (req, res) => {
    const email = req.params.email;
    try {
        const findUser = await user_js_1.default.findOne({ email: email }).populate("companies", "nameCompany cuit");
        //const findUser = await User.findOne({ email: email });
        if (findUser) {
            if (findUser.companies.length > 0) {
                res.status(200).json({
                    companies: findUser.companies,
                });
                console.log(findUser.companies);
            }
            else {
                res.status(204).json({
                    msg: "Companies not found",
                });
            }
        }
        else {
            res.status(205).json({
                msg: "User not found",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.validationCompanyExist = validationCompanyExist;
//postman OK
//graphQL OK
const searchUser = async (req, res) => {
    const email = req.params.email;
    console.log(email);
    try {
        const findUser = await user_js_1.default.findOne({ email: email });
        //const findUser = await User.findOne({ email: email });
        if (findUser) {
            res.status(200).json({
                findUser,
                mgs: "user find",
            });
        }
        else {
            res.status(204).json({
                msg: "Companies not found",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.searchUser = searchUser;
