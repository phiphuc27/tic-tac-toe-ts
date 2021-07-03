import 'reflect-metadata';
import 'dotenv-safe/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { createConnection, getConnectionOptions } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { __prod__ } from './constants';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types/ContextType';
import { refreshToken } from './controllers/refreshToken';
import { ChatResolver } from './resolvers/chat';

const PORT = process.env.PORT || 5000;

const main = async () => {
  // MySQL DB connect
  let options = await getConnectionOptions();
  await createConnection({ ...options, synchronize: !__prod__ });
  console.log(`DB ${options.database} connected...`);

  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(cookieParser());

  // User send refresh token and server will give back a new access token
  app.post('/refresh_token', refreshToken);

  // Connect to Graphql
  const apolloServer = new ApolloServer({
    playground: {
      version: '1.7.40',
    },
    schema: await buildSchema({
      resolvers: [UserResolver, ChatResolver],
      validate: false,
    }),
    subscriptions: {
      path: '/subscriptions',
      onConnect: () => {
        console.log('Client connected for subscriptions');
      },
      onDisconnect: () => {
        console.log('Client disconnected from subscriptions');
      },
    },
    context: ({ req, res }): MyContext => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, () =>
    console.log(`Server is running on PORT ${PORT}`)
  );
};

main().catch((err) => console.error(err));
