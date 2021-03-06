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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_1 = require("express");
var socket_io_1 = require("socket.io");
var chat_schema_1 = require("../schema/chat.schema");
var user_schema_1 = require("../schema/user.schema");
var auth_1 = require("../services/auth");
var router = express_1["default"].Router();
router.get("/", auth_1.verifyToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, chats, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, chat_schema_1["default"].find({
                        users: { $elemMatch: { userId: user === null || user === void 0 ? void 0 : user.userId } }
                    })];
            case 2:
                chats = _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ msg: "Chats are successfully fetched!", payload: chats })];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({ msg: "Something gone wrong!" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put("/:userID", auth_1.verifyToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var chatText, userID, user, chatCheck, chatBody, userData, Chat, error_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chatText = req.body.chatText;
                userID = req.params.userID;
                user = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, chat_schema_1["default"].findOne({
                        $and: [{ "users.userId": user === null || user === void 0 ? void 0 : user.userId }, { "users.userId": userID }]
                    })];
            case 2:
                chatCheck = _a.sent();
                chatBody = {
                    user: user,
                    chat: chatText,
                    createdAt: new Date()
                };
                if (!!chatCheck) return [3 /*break*/, 8];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, user_schema_1["default"].findOne({ userId: userID })];
            case 4:
                userData = _a.sent();
                Chat = new chat_schema_1["default"]({
                    users: [user, userData],
                    chats: [chatBody]
                });
                return [4 /*yield*/, Chat.save()];
            case 5:
                _a.sent();
                socket_io_1.Socket;
                return [2 /*return*/, res
                        .status(200)
                        .json({ msg: "Chat succesfully created!", payload: Chat })];
            case 6:
                error_2 = _a.sent();
                return [2 /*return*/, res.status(404).json({ msg: "User does not exist!" })];
            case 7: return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, chatCheck.update({ $push: { chats: chatBody } })];
            case 9:
                _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ msg: "Message Send", payload: chatCheck })];
            case 10: return [3 /*break*/, 12];
            case 11:
                error_3 = _a.sent();
                return [2 /*return*/, res.status(500).json({ msg: "Something gone wrong!" })];
            case 12: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
