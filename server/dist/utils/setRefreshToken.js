"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshToken = void 0;
const constants_1 = require("../constants");
const setRefreshToken = (res, token) => {
    res.cookie(constants_1.COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: constants_1.__prod__,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/refresh_token',
    });
};
exports.setRefreshToken = setRefreshToken;
//# sourceMappingURL=setRefreshToken.js.map