"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApolloServer = startApolloServer;
const server_1 = require("@apollo/server");
//const express=require("express")
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
//const expressMiddleware = require ("@apollo/server/express4")
//const cors=require("cors")
//const http=require("http")
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
async function startApolloServer(typeDefs, resolvers) {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const serverGQL = new server_1.ApolloServer({
        typeDefs,
        resolvers,
    });
    await serverGQL.start();
    app.use("/graphql", (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(serverGQL));
    await new Promise((resolve) => httpServer.listen({
        port: 4000,
    }, resolve));
    console.log("Server is running on http://localhost:4000/graphql");
}
//https://graphql.org/learn/execution/ documentation
