"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompany = exports.addCompany = void 0;
const company_js_1 = __importDefault(require("../models/company.js"));
const user_js_1 = __importDefault(require("../models/user.js"));
//postman OK
//graphql OK
const addCompany = async (req, res, next) => {
    const { nameCompany, address, cuit, province, country, emailUser } = req.body;
    console.log(emailUser);
    const newCompany = new company_js_1.default({
        nameCompany,
        address,
        cuit,
        province,
        country,
    });
    const findUser = await user_js_1.default.findOne({ email: emailUser });
    if (findUser) {
        newCompany.seller = findUser;
        await newCompany.save();
        if (findUser.companies) {
            findUser.companies.push(newCompany);
            await findUser.save();
        }
        res.json({
            status: "company add successfully",
        });
    }
    else {
        res.status(204).json({
            "msg": "user not found"
        });
    }
};
exports.addCompany = addCompany;
//postman OK
//graphql OK
const getCompany = async (req, res, next) => {
    try {
        if (req.params.id) {
            const findCompany = await company_js_1.default.findById(req.params.id);
            if (findCompany) {
                res.status(200).json({
                    findCompany,
                });
            }
            else {
                res.status(204).json({
                    msg: "no found company",
                });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.getCompany = getCompany;
