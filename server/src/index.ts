import 'reflect-metadata';
import 'dotenv-safe/config';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { ApolloServer } from 'apollo-server-express';
import { createConnection, getConnectionOptions } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { __prod__ } from './constants';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types/ContextType';

const PORT = process.env.PORT || 5000;

const main = async () => {
  // MySQL DB connect
  let options = await getConnectionOptions();
  await createConnection({ ...options, synchronize: !__prod__ });
  console.log(`DB ${options.database} connected...`);

  const app = express();

  // Add session middleware
  app.use(
    session({
      name: 'pid',
      secret: process.env.SESSION_SECRET,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        touchAfter: 60 * 60 * 24 * 7, // 7 day in second
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day in millisecond
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      resave: false,
      saveUninitialized: false,
    })
  );

  // Connect to Graphql
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
};

main();
