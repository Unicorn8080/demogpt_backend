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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureLoggedIn = exports.populateCurrentUser = exports.logout = exports.login = void 0;
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = __importDefault(require("../database/models/user.model"));
const utilities_1 = require("./../utilities/utilities");
const googleClientId = "911588995731-h3sssq8apenpmcnrfiekf5ssugahovvh.apps.googleusercontent.com";
const client = new google_auth_library_1.OAuth2Client(googleClientId);
const verify = (token) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        client.getTokenInfo(token)
            .then((tokenInfo) => {
            const userInfo = (0, utilities_1.getUserInfo)(token);
            resolve(userInfo);
        })
            .catch((error) => {
            resolve(0);
        });
    }));
};
function getOrCreateUser(user) {
    return user_model_1.default.findOne({ googleid: user.googleid }).then((existingUser) => {
        if (existingUser)
            return existingUser;
        const newUser = new user_model_1.default({
            name: user.name,
            googleid: user.googleid,
        });
        return newUser.save();
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = verify(req.body.token.access_token);
        if (userInfo) {
            yield getOrCreateUser(userInfo);
            console.log(`logged in as ${userInfo}`);
            req.session.user = userInfo;
            res.status(200).send(userInfo);
        }
        else {
            console.log(`error${userInfo}`);
            res.status(401).send('unverified user');
        }
    });
}
exports.login = login;
function logout(req, res) {
    if (req.user)
        console.log(`${req.user.name} logged out`);
    req.session.user = null;
    res.send({});
}
exports.logout = logout;
function populateCurrentUser(req, res, next) {
    req.user = req.session.user;
    next();
}
exports.populateCurrentUser = populateCurrentUser;
function ensureLoggedIn(req, res, next) {
    if (!req.user) {
        return res.status(401).send({ err: "not logged in" });
    }
    next();
}
exports.ensureLoggedIn = ensureLoggedIn;
//# sourceMappingURL=googleauth.js.map