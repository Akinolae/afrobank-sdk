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
Object.defineProperty(exports, "__esModule", { value: true });
const index_lib_1 = require("../lib/index.lib");
class Auth {
    constructor(token) {
        this.token = token;
    }
    register(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield index_lib_1.Axios.post("/register", params);
            }
            catch (error) {
                throw error;
            }
        });
    }
    login(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = params;
                const res = yield index_lib_1.Axios.post("/login", { email, password });
                return res.data.message;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUser(params, hasAuth) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountNumber } = params;
                const authorization = hasAuth ? this.authorization() : {};
                const res = yield index_lib_1.Axios.get(`/user/${accountNumber}`, authorization);
                return res.data.message;
            }
            catch (error) {
                throw error;
            }
        });
    }
    enable2FA(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield index_lib_1.Axios.patch(`/enable2fa/${email}`, this.authorization);
                return res.data.message;
            }
            catch (error) {
                throw error;
            }
        });
    }
    disable2FA(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, email } = params;
            try {
                const res = yield index_lib_1.Axios.patch(`/enable2fa/${email}`, { code }, this.authorization());
                return res.data.message;
            }
            catch (error) {
                throw error;
            }
        });
    }
    authorization() {
        return {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };
    }
}
exports.default = Auth;
