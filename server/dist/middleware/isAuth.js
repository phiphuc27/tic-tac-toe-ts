"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuth = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer'))
        throw new apollo_server_express_1.AuthenticationError('Not authenticated');
    try {
        const token = authorization.split(' ')[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        context.payload = payload;
    }
    catch (err) {
        console.error(err);
        throw new apollo_server_express_1.AuthenticationError('Not authenticated');
    }
    return next();
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map