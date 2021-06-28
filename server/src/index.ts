import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createConnection, getConnectionOptions } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { __prod__ } from './constants';
import { UserResolver } from './resolvers/user';

const PORT = process.env.PORT || 5000;

const main = async () => {
  let options = await getConnectionOptions();
  await createConnection({ ...options, synchronize: !__prod__ });
  console.log(`DB ${options.database} connected...`);

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: () => ({}),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
};

main();
