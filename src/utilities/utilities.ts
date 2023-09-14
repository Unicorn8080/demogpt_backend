import dotenv from 'dotenv';
import { post } from './request';
dotenv.config();

const getUserInfoEndPoint = process.env.API_USERINFO_ENDPOINT;
export const getUserInfo = (token: string) => {
  post(getUserInfoEndPoint, {token});
}