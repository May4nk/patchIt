import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from "http";
import { PubSub } from 'graphql-subscriptions';
import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import { allTypeDefs, allResolversAndMutations } from "./models/query.js";
import { usertype } from "./models/resolvers/types/usertypes.js";
import { tokentype } from "./models/resolvers/types/tokentypes.js";
import { findOne } from "./common/queries.js";

dotenv.config({ path: `.env.${ process.env.NODE_ENV }`});

const app: express.Application = express();
const PORT: number = parseInt(<string>process.env.CONN_PORT, 10) || 5000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors<cors.CorsRequest>());

const httpServer = createServer(app);
const pubsub = new PubSub();

const schema = makeExecutableSchema({
  typeDefs: allTypeDefs, 
  resolvers: allResolversAndMutations 
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/',
});

const serverCleanup = useServer({ schema,
  context: { pubsub }
}, wsServer);

const server: ApolloServer = new ApolloServer({        
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ]
});

await server.start();

app.use('/', expressMiddleware(server, {
  context: async({ req }: {req: express.Request}): Promise<any> => { 
    const token: string =  req.headers.authorization || "";
    if(token){
      const userToken: tokentype = await findOne("tokens", { "token": token });
      const user: usertype = await findOne("users", { id: userToken.user_id });
      return { user, pubsub };
    }
  },
}));

//connection
httpServer.listen(PORT, (): void => {
  console.log(`Server is running on port: ${PORT}`);
}).on('err', (e: any): void => {
  console.log(`Error in server: ${e.message}`)
});

export default app;
