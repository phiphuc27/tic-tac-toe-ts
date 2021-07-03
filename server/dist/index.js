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
require("dotenv-safe/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const user_1 = require("./resolvers/user");
const refreshToken_1 = require("./controllers/refreshToken");
const chat_1 = require("./resolvers/chat");
const PORT = process.env.PORT || 5000;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let options = yield typeorm_1.getConnectionOptions();
    yield typeorm_1.createConnection(Object.assign(Object.assign({}, options), { synchronize: !constants_1.__prod__ }));
    console.log(`DB ${options.database} connected...`);
    const app = express_1.default();
    const httpServer = http_1.default.createServer(app);
    app.use(cors_1.default({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));
    app.use(cookie_parser_1.default());
    app.post('/refresh_token', refreshToken_1.refreshToken);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        playground: {
            version: '1.7.40',
        },
        schema: yield type_graphql_1.buildSchema({
            resolvers: [user_1.UserResolver, chat_1.ChatResolver],
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
        context: ({ req, res }) => ({ req, res }),
    });
    apolloServer.applyMiddleware({ app, cors: false });
    apolloServer.installSubscriptionHandlers(httpServer);
    httpServer.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
});
main().catch((err) => console.error(err));
//# sourceMappingURL=index.js.map