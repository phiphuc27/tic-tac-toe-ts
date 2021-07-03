"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const argon2 = __importStar(require("argon2"));
const yup = __importStar(require("yup"));
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const UserResponse_1 = require("../types/UserResponse");
const UserInput_1 = require("../types/UserInput");
const formatValidateErrors_1 = require("../utils/formatValidateErrors");
const isAuth_1 = require("../middleware/isAuth");
const generateToken_1 = require("../utils/generateToken");
const setRefreshToken_1 = require("../utils/setRefreshToken");
let UserResolver = class UserResolver {
    users() {
        return User_1.User.find({});
    }
    user(id) {
        return User_1.User.findOne(id);
    }
    me({ user }) {
        return user;
    }
    register(input, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerSchema = yup.object().shape({
                email: yup.string().email().required(),
                username: yup.string().required(),
                password: yup.string().min(6).required(),
            });
            try {
                yield registerSchema.validate(input);
            }
            catch (err) {
                return { error: formatValidateErrors_1.formatValidateErrors(err) };
            }
            try {
                const hashedPassword = yield argon2.hash(input.password);
                const user = yield User_1.User.create({
                    username: input.username,
                    email: input.email,
                    password: hashedPassword,
                }).save();
                const accessToken = generateToken_1.generateAccessToken(user);
                setRefreshToken_1.setRefreshToken(res, generateToken_1.generateRefreshToken(user));
                return { accessToken, user };
            }
            catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return {
                        error: {
                            field: 'username',
                            message: 'Email or username is already taken.',
                        },
                    };
                }
                return {
                    error: {
                        field: 'server',
                        message: err.message,
                    },
                };
            }
        });
    }
    login(input, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginSchema = yup.object().shape({
                email: yup.string().email().required(),
                password: yup.string().required(),
            });
            try {
                yield loginSchema.validate(input);
            }
            catch (err) {
                return { error: formatValidateErrors_1.formatValidateErrors(err) };
            }
            try {
                const user = yield User_1.User.findOne({ email: input.email });
                if (!user) {
                    return {
                        error: {
                            field: 'email',
                            message: 'Incorrect email or password.',
                        },
                    };
                }
                const isValidPassword = yield argon2.verify(user.password, input.password);
                if (!isValidPassword) {
                    return {
                        error: {
                            field: 'email',
                            message: 'Incorrect email or password.',
                        },
                    };
                }
                const accessToken = generateToken_1.generateAccessToken(user);
                setRefreshToken_1.setRefreshToken(res, generateToken_1.generateRefreshToken(user));
                return { accessToken, user };
            }
            catch (error) {
                return {
                    error: {
                        field: 'server',
                        message: error.message,
                    },
                };
            }
        });
    }
    logout({ res }) {
        try {
            setRefreshToken_1.setRefreshToken(res, '');
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOne(id);
                if (!user)
                    return false;
                yield User_1.User.delete(id);
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput_1.RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map