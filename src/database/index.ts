import mongoose, { ConnectOptions}  from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoConnectionURL = process.env.DB_URI;
const databaseName = process.env.DB_NAME;

const connectOptions : ConnectOptions = {
  dbName: databaseName,
}

mongoose
  .connect("mongodb+srv://johnwilliam199024:TpROlWvjTPU1uwtG@cluster0.hk56zzf.mongodb.net/", connectOptions)
  .then(() => { console.log('server is connected to mongoDB')})
  .catch((err) => { console.log(`1err connecting mongoDB: ${err}`)})

