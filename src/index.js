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
exports.io = void 0;
var express_1 = require("express");
var cors_1 = require("cors");
require("dotenv/config");
var cookie_parser_1 = require("cookie-parser");
var mongoose_1 = require("mongoose");
var user_1 = require("./routes/user");
var chat_1 = require("./routes/chat");
var firebase_admin_1 = require("firebase-admin");
var app_1 = require("firebase-admin/app");
var firebaseConfig_json_1 = require("./firebaseConfig.json");
var morgan_1 = require("morgan");
var socketio = require("socket.io");
var chat_2 = require("./controllers/chat");
var socketUsers_1 = require("./socketUsers");
var app = (0, express_1["default"])();
(0, app_1.initializeApp)({
    credential: firebase_admin_1.credential.cert(firebaseConfig_json_1["default"])
});
app.use((0, morgan_1["default"])("dev"));
app.use((0, cors_1["default"])());
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
app.use((0, cookie_parser_1["default"])());
app.use("/user", user_1["default"]);
app.use("/chat", chat_1["default"]);
app.get("/", function (req, res, next) {
    res.send(process.env.TEST);
});
var server = app.listen(5000, function () {
    mongoose_1["default"].connect("".concat(process.env.DATABASE_URL)).then(function () {
        console.log("Server listening at 5000 Port");
        console.log("MongoDB Connected!");
    });
});
exports.io = new socketio.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
//final Touch
exports.io.on("connection", function (socket) {
    socket.on("joined", function (_a) {
        var _b;
        var userId = _a.userId;
        Object.assign(socketUsers_1.users, (_b = {}, _b[userId] = socket.id, _b));
        socket.emit("joined", { socketId: socketUsers_1.users[userId] });
    });
    socket.on("sendMessage", function (_a) {
        var chatUserId = _a.chatUserId, user = _a.user, chatText = _a.chatText;
        return __awaiter(void 0, void 0, void 0, function () {
            var newChat, user1, user2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, chat_2.SENDMESSAGE)({ user: user, chatUserId: chatUserId, chatText: chatText })];
                    case 1:
                        newChat = _b.sent();
                        user1 = socketUsers_1.users[chatUserId];
                        user2 = socketUsers_1.users[user.userId];
                        exports.io.to([user1, user2]).emit("recieveMessage", { newChat: newChat });
                        return [2 /*return*/];
                }
            });
        });
    });
    socket.on("writting", function (_a) {
        var chatUserId = _a.chatUserId, isWritting = _a.isWritting;
        var user = socketUsers_1.users[chatUserId];
        socket.to(user).emit("writting", isWritting);
    });
});
