"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema, model = mongoose_1["default"].model;
var chatSchema = new Schema({
    users: Array,
    chats: Array
});
var ChatModel = model("chat", chatSchema);
exports["default"] = ChatModel;
