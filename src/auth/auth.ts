import User from '../database/models/user.model'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

function getOrCreateUser(user: any) {
  return User.findOne({ email: user.email }).then((existingUser) => {
    if (existingUser) return existingUser;

    const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password
    });

    return newUser.save();
  })
}

async function register (req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword };
    await User.findOne({ email: user.email})
      .then((existingUser) => {
        if (existingUser) {
          res.status(401).send('You are already registered')
        } else {
          const newUser = new User({
            name: user.name,
            email: user.email,
            password: user.password
          });
          newUser.save();
          res.status(200).send('register successful')
        }
      })
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
} 

async function login (req: Request, res: Response) {
  try {
    const { name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOne({ email: email})
      .then((existingUser) => {
        if( existingUser ) {
          const user = { name, email, password: hashedPassword };
          const token = jwt.sign(user, 'secretKey');
          res.json({ token })
        } else res.status(403).send('Invalid User');
      })
    } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

async function validate ( req: Request, res: Response) {
  try {
    console.log("req.body.token");
    const decoded = jwt.verify(req.body.token, 'secretKey');
    const expirationTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
  
    if (expirationTime < currentTime) {
      console.log('Token has expired');
      res.status(200).send('successful');
    } else {
      console.log('Token is still valid');
      res.status(200).send('successful');
    }
  } catch (error) {
    console.error(error);
    res.status(401).send(error);
    // The token is invalid or has expired
  }
}

export {
  login,
  register,
  validate
}