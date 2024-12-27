import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import http from "http";

export async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const serverGQL = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await serverGQL.start();

  app.use("/graphql", cors(), express.json(), expressMiddleware(serverGQL));

  //SE COMENTA ESTE AL CORRER LOS TEST PORQUE DE LO CONTRARIO SE VISUALIZA ERROR
  // await new Promise((resolve) =>
  //   httpServer.listen(
  //     {
  //       port: 4000,
  //     },
  //     resolve
  //   )
  // );
  // console.log("Server is running on http://localhost:4000/graphql");
}

//https://graphql.org/learn/execution/ documentation
