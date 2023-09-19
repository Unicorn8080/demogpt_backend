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
exports.validate = exports.register = exports.login = void 0;
const user_model_1 = __importDefault(require("../database/models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const service_1 = require("./service");
function getOrCreateUser(user) {
    return user_model_1.default.findOne({ email: user.email }).then((existingUser) => {
        if (existingUser)
            return existingUser;
        const newUser = new user_model_1.default({
            name: user.name,
            email: user.email,
            password: user.password,
        });
        return newUser.save();
    });
}
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            console.log(name, email, password);
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = { name, email, password: hashedPassword };
            yield user_model_1.default.findOne({ email: user.email }).then((existingUser) => {
                if (existingUser) {
                    res.status(401).send("You are already registered");
                }
                else {
                    const newUser = new user_model_1.default({
                        name: user.name,
                        email: user.email,
                        password: user.password,
                    });
                    newUser.save();
                    res.status(200).send("register successful");
                }
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
exports.register = register;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password, code } = req.body;
            console.log('code=====>', code);
            if (!code) {
                const existingUser = yield user_model_1.default.findOne({ email: email });
                if (existingUser) {
                    const randomNumber = generateVerificationCode();
                    existingUser.verifyCode = randomNumber;
                    yield existingUser.save();
                    (0, service_1.sendMail)(name, email, randomNumber, "You need to verify your email");
                    res.send(true);
                }
                else {
                    res.status(401).send("invalid user");
                }
            }
            else {
                const verifyUser = yield user_model_1.default.findOne({ verifyCode: code });
                console.log('codeuser====', code, verifyUser);
                if (verifyUser) {
                    // const hashedPassword = await bcrypt.hash(existingUser.password, 10);
                    const user = { name: verifyUser.name, email: verifyUser.email, password: verifyUser.password };
                    const token = jsonwebtoken_1.default.sign(user, "secretKey");
                    res.json({ token });
                }
                else
                    res.status(403).send(false);
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
exports.login = login;
function validate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body.token);
            const decoded = jsonwebtoken_1.default.verify(req.body.token, "secretKey");
            const expirationTime = decoded.exp;
            const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
            if (expirationTime < currentTime) {
                console.log("Token has expired");
                res.status(200).send({ status: "successful" });
            }
            else {
                console.log("Token is still valid");
                res.status(200).send({ status: "successful" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(401).send(error);
            // The token is invalid or has expired
        }
    });
}
exports.validate = validate;
// async function handler(req: Request, res: Response) {
//   if (req.method === "POST") {
//     const { code } = req.body;
//     // Check if the entered code matches the generated code
//     const isCodeValid = validateVerificationCode(code); // Implement your validation logic here
//     if (isCodeValid) {
//       res.status(200).json({ success: true });
//     } else {
//       res.status(400).json({ success: false });
//     }
//   } else {
//     res.status(404).end();
//   }
// }
const generateVerificationCode = () => {
    // Generate a random six-digit verification code
    const min = 100000;
    const max = 999999;
    const code = Math.floor(Math.random() * (max - min + 1) + min);
    return String(code);
};
//# sourceMappingURL=auth.js.map