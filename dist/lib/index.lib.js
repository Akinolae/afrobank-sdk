"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axios = void 0;
const axios_1 = __importDefault(require("axios"));
const Axios = axios_1.default.create({
    baseURL: "https://afrobank.herokuapp.com/Api/v1",
});
exports.Axios = Axios;
