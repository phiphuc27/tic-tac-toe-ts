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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("../entities/User");
const isAuth = ({ context }, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = context.req.headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer')) {
        context.user = undefined;
        return next();
    }
    try {
        const token = authorization.split(' ')[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = yield User_1.User.findOne(payload.userID);
        context.user = user;
    }
    catch (err) {
        console.error(err);
        throw new Error('Not authenticated');
    }
    return next();
});
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map