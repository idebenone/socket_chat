import * as dotenv from "dotenv";
dotenv.config();

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User';

import response from "../utilities/response";
import { generateOTP } from "../utilities/otp";

const saltRounds = 10;
const auth = Router();

auth.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) res.status(422).json(response.MISSING)
    try {
        const user: any = await User.find({ username }).exec();
        if (user.length === 0) return res.status(404).json(response.NOT_FOUND)

        const decryptedPass = await bcrypt.compare(password, user[0].password)
        if (user && decryptedPass) {
            const token = jwt.sign(
                { user_id: user[0]._id, time: new Date().getTime() },
                process.env.SECRET_KEY_AUTH || '',
                { expiresIn: '1d' }
            );
            return res.status(201).json(response.OK({ token, username: user[0].username, id: user[0]._id }));
        }
        return res.status(401).json(response.UN_AUTHORIZED);
    } catch (error) {
        console.log(error)
        res.status(501).json(response.SYSTEM_ERROR)
    }
})

auth.post("/register", async (req: Request, res: Response) => {
    const { email, name, username, password } = req.body;
    if (!email || !name || !username || !password) res.status(422).json(response.MISSING)
    try {
        const user: any = await User.find({ email }).exec();
        if (user.length === 0) {
            const otp = generateOTP();
            const encryptedPass = await bcrypt.hash(password, saltRounds);
            const newUser = new User({ email, name, username, password: encryptedPass, otp });
            await newUser.save();
            return res.status(201).json(response.CREATED);
        } else if (user[0].is_verified === false) {
            const otp = generateOTP();
            await User.findOneAndUpdate({ email }, { $set: { otp } }).exec();
            return res.status(201).json(response.CREATED);
        } else {
            return res.status(400).json(response.UNABLE_TO_PROCESS);
        }
    } catch (error) {
        res.status(501).json(response.SYSTEM_ERROR)
    }
})

auth.post("/verify", async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) res.status(422).json(response.MISSING)
    try {
        const user: any = await User.find({ email }).exec();
        if (user && user[0].otp === parseInt(otp)) {
            const updateUser = await User.findOneAndUpdate({ email: email }, { $set: { is_verified: true } }, { new: true }).exec()
            const token = jwt.sign(
                { user_id: user._id, time: new Date().getTime() },
                process.env.SECRET_KEY_AUTH || '',
                { expiresIn: '1d' }
            );
            res.status(201).json(response.OK({ token, username: user[0].username, id: user[0]._id }))
        } else {
            res.status(201).json({ message: "Invalid OTP" })
        }
    } catch (error) {
        res.status(501).json(response.SYSTEM_ERROR)
    }
})

export default auth;