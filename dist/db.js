"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
let connection;
dotenv_1.default.config(); // Carga las variables del archivo .env
const { DB_USER, DB_PASSWORD, BDMASCOSTASPREPROD } = process.env;
const mongoUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.b5p91.mongodb.net/${BDMASCOSTASPREPROD}?retryWrites=true&w=majority`;
const connectDB = mongoose_1.default.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
//useFindAndModify: false para solucionar
// DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated
mongoose_1.default.connection.on("connected", () => {
    console.log("Mongoose is connected!!!!");
});
exports.default = connectDB;
