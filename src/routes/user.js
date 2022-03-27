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
var user_schema_1 = require("../schema/user.schema");
var bcrypt_1 = require("bcrypt");
var uuidv4_1 = require("uuidv4");
var firebase_admin_1 = require("firebase-admin");
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = require("../services/auth");
var axios_1 = require("axios");
var router = express_1["default"].Router();
router.get("/", auth_1.verifyToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var value, users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                value = req.query.value;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_schema_1["default"].find({ $text: { $search: value } }, { password: 0 })];
            case 2:
                users = _a.sent();
                if (users.length <= 0) {
                    return [2 /*return*/, res.status(404).json({ msg: "No users found!" })];
                }
                return [2 /*return*/, res.status(200).json({ msg: "Users Send!", payload: users })];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({ msg: "Something gone wrong" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/register", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, name, surname, authType, emailRegEx, passwordRegEx, userCheck, hashed, displayName, newUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, name = _a.name, surname = _a.surname, authType = _a.authType;
                emailRegEx = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
                passwordRegEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.-_])(?=.{8,})");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                if (!email || !password || !name || !surname) {
                    return [2 /*return*/, res.status(404).json({ msg: "Invalid Inputs" })];
                }
                if (!emailRegEx.test(email) || !passwordRegEx.test(password)) {
                    return [2 /*return*/, res.status(406).json({ msg: "Invalid Inputs" })];
                }
                email = email.toLowerCase();
                return [4 /*yield*/, user_schema_1["default"].findOne({ email: email })];
            case 2:
                userCheck = _b.sent();
                if (userCheck) {
                    return [2 /*return*/, res.status(406).json({ msg: "Email is already taken!" })];
                }
                return [4 /*yield*/, bcrypt_1["default"].hash(password, 10)];
            case 3:
                hashed = _b.sent();
                displayName = name.slice(0, 1).toUpperCase() +
                    name.slice(1) +
                    " " +
                    surname.slice(0, 1).toUpperCase() +
                    surname.slice(1);
                newUser = new user_schema_1["default"]({
                    displayName: displayName,
                    email: email,
                    password: hashed,
                    authType: authType,
                    userId: (0, uuidv4_1.uuid)()
                });
                return [4 /*yield*/, newUser.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ msg: "Registered!", payload: newUser })];
            case 5:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).send("Something gone wrong!")];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post("/login", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, bodyPassword, authtype, authorization, googleUser, error_3, userCheck, user, error_4, user, userToSend, accessToken, refreshToken, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, bodyPassword = _a.bodyPassword;
                authtype = req.headers.authtype;
                authorization = req.headers.authorization;
                if (!(authtype === "google" && authorization)) return [3 /*break*/, 9];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, firebase_admin_1.auth)().verifyIdToken(authorization)];
            case 3:
                googleUser = _b.sent();
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(402).json({ msg: "Unauthorized Access!" })];
            case 5: return [4 /*yield*/, user_schema_1["default"].findOne({
                    email: googleUser.email
                })];
            case 6:
                userCheck = _b.sent();
                if (userCheck && userCheck.authType === "custom") {
                    return [2 /*return*/, res.status(406).json({ msg: "Email is already exist!" })];
                }
                if (userCheck) {
                    return [2 /*return*/, res
                            .status(200)
                            .json({ msg: "Successfully logged in.", payload: userCheck })];
                }
                user = new user_schema_1["default"]({
                    displayName: googleUser.name,
                    email: googleUser.email,
                    authType: authtype,
                    userId: googleUser.uid,
                    avatar: googleUser.picture
                });
                return [4 /*yield*/, user.save()];
            case 7:
                _b.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ msg: "Successfully logged in.", payload: user })];
            case 8:
                error_4 = _b.sent();
                return [2 /*return*/, res.status(500).send("Something gone wrong!")];
            case 9:
                if (!(authtype === "custom")) return [3 /*break*/, 13];
                _b.label = 10;
            case 10:
                _b.trys.push([10, 12, , 13]);
                if (!email || !bodyPassword) {
                    return [2 /*return*/, res.status(404).json({ msg: "Invalid Inputs" })];
                }
                email = email.toLowerCase();
                return [4 /*yield*/, user_schema_1["default"].findOne({
                        email: email,
                        authtype: authtype
                    })];
            case 11:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ msg: "Email isn't exist!" })];
                }
                if (!bcrypt_1["default"].compareSync(bodyPassword, user.password)) {
                    return [2 /*return*/, res.status(406).json({ msg: "Password isn't correct!" })];
                }
                userToSend = {
                    email: user.email,
                    userId: user.userId,
                    avatar: user.avatar,
                    displayName: user.displayName,
                    authType: user.authType
                };
                accessToken = jsonwebtoken_1["default"].sign(userToSend, "".concat(process.env.JWT_SECRET), {
                    expiresIn: "15m"
                });
                refreshToken = jsonwebtoken_1["default"].sign(userToSend, "".concat(process.env.REFRESH_SECRET), {
                    expiresIn: "90days"
                });
                console.log(user);
                return [2 /*return*/, res.status(200).json({
                        msg: "Logged in!",
                        payload: { data: user, accessToken: accessToken, refreshToken: refreshToken }
                    })];
            case 12:
                error_5 = _b.sent();
                console.log(error_5);
                return [2 /*return*/, res.status(500).send("Something gone wrong!")];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post("/refresh-token", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authtype, refreshToken, data, error_6, data, accessToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authtype = req.headers.authtype;
                refreshToken = req.body.refreshToken;
                if (!(authtype === "google")) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1["default"].post("https://securetoken.googleapis.com/v1/token?key=".concat((process.env.API_KEY)), { grant_type: "refresh_token", refresh_token: refreshToken })];
            case 2:
                data = (_a.sent()).data;
                return [2 /*return*/, res
                        .status(200)
                        .json({ response: "Token renewed.", payload: data.access_token })];
            case 3:
                error_6 = _a.sent();
                return [2 /*return*/, res.status(500).send("Something Gone Wrong!")];
            case 4: return [3 /*break*/, 6];
            case 5:
                data = jsonwebtoken_1["default"].verify(req.body.refreshToken, process.env.REFRESH_SECRET);
                accessToken = jsonwebtoken_1["default"].sign(data, process.env.JWT_SECRET);
                return [2 /*return*/, res
                        .status(200)
                        .json({ response: "Token renewed.", payload: accessToken })];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
