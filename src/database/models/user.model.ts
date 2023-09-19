import mongoose, { Document, Model, Schema } from 'mongoose';
import type IUser from './../../interfaces/IUser';


const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String },
  token: {
    type: String,
    required : false,
    uniqued: false
  },
  email: {
    type: String,
    uniqued: true,
  },
  password:{
    type: String,
    uniqued: false,
  },
  verifyCode:{
    type: String,
    required: false
  }
});

const UserModel: Model<IUser> = mongoose.model<IUser>('user', UserSchema);

export default UserModel;