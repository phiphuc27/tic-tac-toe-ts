"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.ChatResolver = void 0;
const Chat_1 = require("../entities/Chat");
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
const isAuth_1 = require("../middleware/isAuth");
let ChatResolver = class ChatResolver {
    constructor() {
        this.rooms = {};
    }
    joinRoom({ id, chats }, roomId) {
        return { id, chats };
    }
    getChatsInRoom(roomId) {
        return this.rooms[roomId];
    }
    createChat(pubSub, { user }, message, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            let room = this.rooms[roomId];
            if (!room) {
                this.rooms[roomId] = {
                    id: roomId,
                    chats: [],
                };
            }
            room = this.rooms[roomId];
            const chat = { id: uuid_1.v4(), user: user.username, message };
            room.chats.push(chat);
            yield pubSub.publish(roomId, room);
            return chat;
        });
    }
};
__decorate([
    type_graphql_1.Subscription({
        topics: ({ args }) => args.roomId,
    }),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Arg('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Chat_1.Room, String]),
    __metadata("design:returntype", Chat_1.Room)
], ChatResolver.prototype, "joinRoom", null);
__decorate([
    type_graphql_1.Query(() => Chat_1.Room, { nullable: true }),
    __param(0, type_graphql_1.Arg('room')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatResolver.prototype, "getChatsInRoom", null);
__decorate([
    type_graphql_1.Mutation(() => Chat_1.Chat),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.PubSub()),
    __param(1, type_graphql_1.Ctx()),
    __param(2, type_graphql_1.Arg('message')),
    __param(3, type_graphql_1.Arg('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [type_graphql_1.PubSubEngine, Object, String, String]),
    __metadata("design:returntype", Promise)
], ChatResolver.prototype, "createChat", null);
ChatResolver = __decorate([
    type_graphql_1.Resolver(Chat_1.Room)
], ChatResolver);
exports.ChatResolver = ChatResolver;
//# sourceMappingURL=chat.js.map