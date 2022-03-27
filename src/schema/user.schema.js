"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema, model = mongoose_1["default"].model;
var userSchema = new Schema({
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    authType: { type: String || null, required: true },
    avatar: {
        type: String,
        "default": "https://firebasestorage.googleapis.com/v0/b/chat-app-f368c.appspot.com/o/blank-profile-picture-973460_960_720.png?alt=media&token=bfd9ac78-bd77-42d3-867a-a95b912b508e"
    },
    userId: { type: String, required: true }
});
userSchema.index({ displayName: "text", email: "text" });
var UserModel = model("User", userSchema);
exports["default"] = UserModel;
