"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoConnectionURL = process.env.DB_URI;
const databaseName = process.env.DB_NAME;
const connectOptions = {
    dbName: databaseName,
};
mongoose_1.default
    .connect("mongodb+srv://johnwilliam199024:TpROlWvjTPU1uwtG@cluster0.hk56zzf.mongodb.net/", connectOptions)
    .then(() => { console.log('server is connected to mongoDB'); })
    .catch((err) => { console.log(`1err connecting mongoDB: ${err}`); });
//# sourceMappingURL=index.js.map