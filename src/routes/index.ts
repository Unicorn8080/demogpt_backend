import express, { Request, Response, NextFunction } from 'express';
import * as googleAuth from '../auth/googleauth'
import * as auth from '../auth/auth';
import type User from './../interfaces/IUser'
const router = express.Router();

console.log("😀");
router.post('/login', googleAuth.login);
router.post('/register', auth.register)
router.post('/logout', googleAuth.logout);
router.post('/login/manual', auth.login);
router.post('/whoami', auth.validate)

export default router;
