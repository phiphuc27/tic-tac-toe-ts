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
exports.refreshToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("../entities/User");
const generateToken_1 = require("../utils/generateToken");
const setRefreshToken_1 = require("../utils/setRefreshToken");
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.jid;
    if (!refreshToken)
        return res.send({ success: false, accessToken: '' });
    try {
        const payload = jsonwebtoken_1.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = yield User_1.User.findOne({ id: payload.userID });
        if (!user)
            return res.send({ success: false, accessToken: '' });
        if (user.tokenVersion !== payload.tokenVersion)
            return res.send({ success: false, accessToken: '' });
        const accessToken = generateToken_1.generateAccessToken(user);
        setRefreshToken_1.setRefreshToken(res, generateToken_1.generateRefreshToken(user));
        return res.send({ success: true, accessToken });
    }
    catch (err) {
        return res.send({ success: false, accessToken: '' });
    }
});
exports.refreshToken = refreshToken;
//# sourceMappingURL=refreshToken.js.map