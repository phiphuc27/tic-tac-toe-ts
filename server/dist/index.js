"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const user_1 = require("./resolvers/user");
const PORT = process.env.PORT || 5000;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let options = yield typeorm_1.getConnectionOptions();
    yield typeorm_1.createConnection(Object.assign(Object.assign({}, options), { synchronize: !constants_1.__prod__ }));
    console.log(`DB ${options.database} connected...`);
    const app = express_1.default();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [user_1.UserResolver],
            validate: false,
        }),
        context: () => ({}),
    });
    apolloServer.applyMiddleware({ app });
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
});
main();
//# sourceMappingURL=index.js.map