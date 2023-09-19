import User from "../database/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { sendMail } from "./service";
import IUser from "../interfaces/IUser";

function getOrCreateUser(user: any) {
  return User.findOne({ email: user.email }).then((existingUser) => {
    if (existingUser) return existingUser;

    const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    return newUser.save();
  });
}

async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword };
    await User.findOne({ email: user.email }).then((existingUser) => {
      if (existingUser) {
        res.status(401).send("You are already registered");
      } else {
        const newUser = new User({
          name: user.name,
          email: user.email,
          password: user.password,
        });
        newUser.save();
        res.status(200).send("register successful");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



async function login(req: Request, res: Response) {
  try {
    const { name, email, password, code } = req.body;
    console.log('code=====>', code);
    
    if(!code) {
      const existingUser = await User.findOne({ email: email });
      if(existingUser) {
        const randomNumber = generateVerificationCode();
        existingUser.verifyCode = randomNumber;
        await existingUser.save();
        sendMail(name, email, randomNumber, "You need to verify your email");
        res.send(true);
      } else {
        res.status(401).send("invalid user");
      }
    } else {
      const verifyUser = await User.findOne({ verifyCode: code });
      console.log('codeuser====', code, verifyUser)
      if (verifyUser) {
        // const hashedPassword = await bcrypt.hash(existingUser.password, 10);
        const user = {name:verifyUser.name, email:verifyUser.email, password: verifyUser.password}
        const token = jwt.sign(user, "secretKey");
        res.json({token});
      }
      else res.status(403).send(false);
    } 
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function validate(req: Request, res: Response) {
  try {
    console.log(req.body.token);
    const decoded = jwt.verify(req.body.token, "secretKey");
    const expirationTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

    if (expirationTime < currentTime) {
      console.log("Token has expired");
      res.status(200).send({status:"successful"});
    } else {
      console.log("Token is still valid");
      res.status(200).send({status:"successful"});
    }
  } catch (error) {
    console.error(error);
    res.status(401).send(error);
    // The token is invalid or has expired
  }
}

// async function handler(req: Request, res: Response) {
//   if (req.method === "POST") {
//     const { code } = req.body;

//     // Check if the entered code matches the generated code
//     const isCodeValid = validateVerificationCode(code); // Implement your validation logic here

//     if (isCodeValid) {
//       res.status(200).json({ success: true });
//     } else {
//       res.status(400).json({ success: false });
//     }
//   } else {
//     res.status(404).end();
//   }
// }

const generateVerificationCode: () => string = () => {
  // Generate a random six-digit verification code
  const min = 100000;
  const max = 999999;
  const code = Math.floor(Math.random() * (max - min + 1) + min);
  return String(code);
};

// Usage
// const verificationCode = generateVerificationCode();
// console.log(verificationCode);

export { login, register, validate };
