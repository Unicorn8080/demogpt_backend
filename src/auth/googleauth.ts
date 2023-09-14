import { OAuth2Client, TokenPayload } from 'google-auth-library'
import User from '../database/models/user.model'
import { Request, Response, NextFunction } from 'express'
import { getUserInfo } from './../utilities/utilities'

const googleClientId =
  "911588995731-h3sssq8apenpmcnrfiekf5ssugahovvh.apps.googleusercontent.com";
const client = new OAuth2Client(googleClientId);

const verify = (token: string): Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    client.getTokenInfo(token)
      .then((tokenInfo) => {
        const userInfo = getUserInfo(token);
        resolve(userInfo);
      })
      .catch((error) => {
        resolve(0);
      })
  })
}

function getOrCreateUser(user: any) {
  return User.findOne({ googleid: user.googleid }).then((existingUser) => {
    if (existingUser) return existingUser;

    const newUser = new User({
      name: user.name,
      googleid: user.googleid,
    });

    return newUser.save();
  })
}

async function login(req: Request & { session: any }, res: Response) {
  const userInfo = verify(req.body.token.access_token);
  if (userInfo) {
    await getOrCreateUser(userInfo);
    console.log(`logged in as ${userInfo}`)
    req.session.user = userInfo;
    res.status(200).send(userInfo);
  } else {
    console.log(`error${userInfo}`)
    res.status(401).send('unverified user')
  }
}

function logout(req: Request & { session: any, user: any}, res: Response) {
  if (req.user) console.log(`${req.user.name} logged out`);
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req: Request & { user: any; session: any}, res: Response, next: NextFunction) {
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req: Request & { user: any}, res: Response, next: NextFunction) {
  if(!req.user) {
    return res.status(401).send({ err: "not logged in"});
  }
  next();
}

export {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
};