import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cookieParser from "cookie-parser";
import { JwtPayload } from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import express, { Request, Response } from "express";
import { ApolloServer, BaseContext } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";

//utils
import { findOne } from "./utils/queriesutils.js";
import { verifyToken } from "./utils/tokenutils.js";

//queries
import { allTypeDefs, allResolversAndMutations } from "./models/query.js";

//types
import { usertype } from "./models/resolvers/types/usertypes.js";

//const & configs
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const pubsub: PubSub = new PubSub();
const app: express.Application = express();
const PORT: number = parseInt(<string>process.env.CONN_PORT, 10);

// limit 1000 requests from an IP in 15 mins
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

//middlewares
app.use(cors<cors.CorsRequest>(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

const httpServer = createServer(app);

const schema = makeExecutableSchema({
  typeDefs: allTypeDefs,
  resolvers: allResolversAndMutations,
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});

const serverCleanup = useServer({ schema, context: { pubsub } }, wsServer);

const server: ApolloServer = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== "prod",
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
    process.env.NODE_ENV === "prod"
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageLocalDefault({
          footer: false,
          embed: {
            endpointIsEditable: true,
          },
        }),
  ],
});

await server.start();

app.use(
  "/",
  expressMiddleware(server, {
    context: async ({
      req,
      res,
    }: {
      req: Request;
      res: Response;
    }): Promise<BaseContext> => {
      try {
        const token: string = req.headers.authorization || "";

        if (token) {
          const tokenUser: JwtPayload = verifyToken(
            token,
            `${process.env.ACCESS_TOKEN_SECRET}`
          ) as JwtPayload;

          if (typeof tokenUser === "string" || !tokenUser.id) {
            throw new Error("User Not Authorized");
          }

          const user: usertype = await findOne("users", { id: tokenUser.id });

          return { req, res, user, pubsub };
        }

        return { res };
      } catch (err) {
        throw new Error(`Context Error: ${err}`);
      }
    },
  })
);

//connection
httpServer
  .listen(PORT, (): void => {
    console.log(`Server is running on port: ${PORT}`);
  })
  .on("err", (e: any): void => {
    console.log(`Error in server: ${e.message}`);
  });

export default app;
