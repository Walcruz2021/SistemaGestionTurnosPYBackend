"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_js_1 = require("./server/app.js");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const db_js_1 = __importDefault(require("./db.js"));
const PORT = process.env.PORT || 3002;
const api_js_1 = __importDefault(require("./routes/api.js"));
const routeGastos_js_1 = __importDefault(require("./routes/routeGastos.js"));
const routeGastos_js_2 = __importDefault(require("./routes/routeGastos.js"));
const resolvers_js_1 = __importDefault(require("./server/graphql/resolvers.js"));
const routeClients_js_1 = __importDefault(require("./routes/routeClients.js"));
const typeDefs_js_1 = __importDefault(require("./server/graphql/typeDefs.js"));
//esto debe estar activado para que se ejecute la opcion de envio de notificaciones
//import alertScheduler from "././routes/alertScheduler.js"
db_js_1.default;
const app = (0, express_1.default)();
(0, app_js_1.startApolloServer)(typeDefs_js_1.default, resolvers_js_1.default);
// // Orígenes permitidos
const allowedOrigins = [
    "http://localhost:3000",
    "https://frontend-app-peluqueria.vercel.app", // Reemplaza esto con la URL de tu frontend en Vercel
];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("tiny"));
app.use("/api", api_js_1.default);
app.use("/api", routeGastos_js_1.default);
app.use("/api", routeGastos_js_2.default);
app.use("/api", routeClients_js_1.default);
app.listen(PORT, () => {
    console.log(`Server is starting at ${PORT}`);
});
exports.default = app;
