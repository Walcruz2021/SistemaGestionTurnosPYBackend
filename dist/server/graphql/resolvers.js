"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import Cliente from "../../models/cliente.js";
//import Perro from "../../models/perro.js";
const user_js_1 = __importDefault(require("../../models/user.js"));
const company_js_1 = __importDefault(require("../../models/company.js"));
const turno_js_1 = __importDefault(require("../../models/turno.js"));
const cliente_js_1 = __importDefault(require("../../models/cliente.js"));
//import User from "../../models/user.js";
const faker_1 = require("@faker-js/faker");
const resolvers = {
    Query: {
        getCompanyxId: async (_, { id }) => {
            try {
                if (id) {
                    const findCompany = await company_js_1.default.findById(id);
                    if (findCompany) {
                        return findCompany;
                    }
                    else {
                        throw new Error("Company not found");
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        searchUser: async (_, { email }) => {
            try {
                const findUser = await user_js_1.default.findOne({ email }).populate("companies");
                if (findUser) {
                    return findUser;
                }
                else {
                    throw new Error("User not found");
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        validationCompanyExist: async (_, { email }) => {
            try {
                const findUser = await user_js_1.default.findOne({ email: email }).populate("companies", "nameCompany cuit");
                if (findUser) {
                    if (findUser.companies.length > 0) {
                        return findUser.companies;
                    }
                    else {
                        throw new Error("companies not found");
                    }
                }
                else {
                    throw new Error("User not found");
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        getTurnos: async (_, { idComp }) => {
            const idCompany = idComp;
            try {
                const turnos = await turno_js_1.default.find({ Company: idCompany });
                if (turnos.length > 0) {
                    return turnos;
                }
                else {
                    throw new Error("not found turnos");
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        },
        listClientId: async (_, { idClient }) => {
            const buscado = await cliente_js_1.default.findById(idClient);
            if (buscado) {
                return buscado;
            }
            else
                throw new Error("client not found");
        },
        listClients: async (_, { idCompany }) => {
            try {
                if (idCompany) {
                    const findClients = await cliente_js_1.default.find({
                        status: true,
                        Company: idCompany,
                    });
                    return findClients;
                }
            }
            catch (err) {
                return err;
            }
        },
    },
    Mutation: {
        addCompany: async (_, { nameCompany, address, cuit, province, country, emailUser }) => {
            const findUser = await user_js_1.default.findOne({ email: emailUser });
            if (findUser) {
                const newCompany = new company_js_1.default({
                    nameCompany: nameCompany || faker_1.faker.person.fullName(),
                    address: address || `${faker_1.faker.location.streetAddress()}`,
                    cuit: cuit || faker_1.faker.phone.number("+1 ###-###-####"),
                    province: province || faker_1.faker.location.city(),
                    country: country || faker_1.faker.location.country(),
                });
                newCompany.seller = findUser;
                await newCompany.save();
                if (findUser.companies) {
                    findUser.companies.push(newCompany);
                    await findUser.save();
                }
                return newCompany;
            }
        },
        addUser: async (_, { fullName, status, email }) => {
            const newUser = new user_js_1.default({
                fullName: fullName || faker_1.faker.person.fullName(),
                status: status !== null ? status : true,
                email: email || faker_1.faker.internet.email(),
            });
            const findUser = await user_js_1.default.findOne({ email: email });
            if (!findUser) {
                await newUser.save();
                return newUser;
            }
            else {
                throw new Error("User not found");
            }
        },
        addClient: async (_, { name, phone, address, notesCli, status, Company }) => {
            try {
                const cliente = new cliente_js_1.default({
                    name: name || faker_1.faker.person.fullName(),
                    phone: phone || faker_1.faker.phone.number("+1 ###-###-####"),
                    address: address || `${faker_1.faker.location.streetAddress()}`,
                    notesCli: notesCli || faker_1.faker.lorem.sentence(),
                    status: status !== null ? status : true,
                    Company,
                });
                await cliente.save();
            }
            catch (error) {
                console.log(error);
            }
        },
        addTurno: async (_, { name, nameDog, phone, date, notesTurn, idClient, time, idDog, Company }) => {
            try {
                const cliente = await cliente_js_1.default.findById(idClient);
                if (!cliente) {
                    throw new Error("Client not found");
                }
                const turno = new turno_js_1.default({
                    name,
                    nameDog,
                    phone,
                    date,
                    notesTurn,
                    idClient,
                    time,
                    idDog,
                    Company,
                });
                turno.Client = cliente;
                await turno.save();
                cliente.turnos.push(turno);
                await cliente.save();
                return turno;
            }
            catch (err) {
                next(err);
            }
        },
    },
};
exports.default = resolvers;
