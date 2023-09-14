import express, { Request, Response, NextFunction } from 'express';
import * as googleAuth from '../auth/googleauth'
import * as auth from '../auth/auth';
import type User from './../interfaces/IUser'
const router = express.Router();

console.log("😀");
router.post('/login', googleAuth.login);
router.post('/logout', googleAuth.logout);
router.post('/login/manual', auth.login);
router.get('/whoami', (req: Request & { user: User}, res: Response) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send({});
  }
})

export default router;