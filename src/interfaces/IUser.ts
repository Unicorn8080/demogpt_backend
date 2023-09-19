export default interface IUser extends Document {
  name: string;
  token?: string;
  email?: string;
  password?: string;
  verifyCode?: string;
}