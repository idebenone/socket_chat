import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/User'

import response from "../utilities/response";

export const validate = async (req: Request, res: Response, next: NextFunction) => {
    var token = req.headers["x-access-token"]
    if (!token) return res.status(401).json(response.UN_AUTHORIZED)
    try {
        const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY_AUTH || '')
        const user: any = await User.findById({ _id: decoded.user_id }).exec()
        if (user.length !== 0 && user.is_verified == true) {
            res.locals.user_id = decoded.user_id;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS,"
            );
            res.setHeader(
                "Access-Control-Allow-Headers",
                "origin, content-type, accept,x-access-token"
            );
            next()
        } else {
            return res.status(401).json(response.UN_AUTHORIZED)
        }
    } catch (error) {
        console.log(error)
        res.status(501).json(response.SYSTEM_ERROR)
    }
}