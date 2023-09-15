"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const request_1 = require("./request");
dotenv_1.default.config();
const getUserInfoEndPoint = process.env.API_USERINFO_ENDPOINT;
const getUserInfo = (token) => {
    (0, request_1.post)(getUserInfoEndPoint, { token });
};
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=utilities.js.map