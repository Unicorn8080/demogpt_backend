import mongoose, { ConnectOptions}  from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoConnectionURL = process.env.DB_URI;
const databaseName = process.env.DB_NAME;

const connectOptions : ConnectOptions = {
  dbName: databaseName,
}

mongoose
  .connect(mongoConnectionURL, connectOptions)
  .then(() => { console.log('server is connected to mongoDB')})
  .catch((err) => { console.log(`1err connecting mongoDB: ${err}`)})

