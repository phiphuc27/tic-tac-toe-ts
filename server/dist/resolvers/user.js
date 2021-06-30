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
const registerSchema = yup.object().shape({
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().min(6).required(),
});
const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});
let UserResolver = class UserResolver {
    users() {
        return User_1.User.find({});
    }
    user(id) {
        return User_1.User.findOne(id);
    }
    me({ req }) {
        if (!req.session.userID)
            return null;
        return User_1.User.findOne(req.session.userID);
    }
    register(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield registerSchema.validate(input, { abortEarly: false });
            }
            catch (error) {
                const errors = formatValidateErrors_1.formatValidateErrors(error);
                return { errors };
            }
            try {
                const hashedPassword = yield argon2.hash(input.password);
                const user = yield User_1.User.create({
                    username: input.username,
                    email: input.email,
                    password: hashedPassword,
                }).save();
                req.session.userID = user.id;
                return { user };
            }
            catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return {
                        errors: [
                            {
                                field: 'username',
                                message: 'Email or username is already taken.',
                            },
                        ],
                    };
                }
                return {
                    errors: [
                        {
                            field: 'server',
                            message: error.message,
                        },
                    ],
                };
            }
        });
    }
    login(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield loginSchema.validate(input, { abortEarly: false });
                const user = yield User_1.User.findOne({ email: input.email });
                if (!user) {
                    return {
                        errors: [
                            {
                                field: 'email',
                                message: 'Incorrect email or password.',
                            },
                        ],
                    };
                }
                const isValidPassword = yield argon2.verify(user.password, input.password);
                if (!isValidPassword) {
                    return {
                        errors: [
                            {
                                field: 'email',
                                message: 'Incorrect email or password.',
                            },
                        ],
                    };
                }
                req.session.userID = user.id;
                return { user };
            }
            catch (error) {
                console.error(error);
                if (error.name === 'ValidationError') {
                    const errors = formatValidateErrors_1.formatValidateErrors(error);
                    return { errors };
                }
                return {
                    errors: [
                        {
                            field: 'server',
                            message: error.message,
                        },
                    ],
                };
            }
        });
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
                console.error(error);
                return error;
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