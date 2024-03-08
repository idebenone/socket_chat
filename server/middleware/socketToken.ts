import jwt from 'jsonwebtoken'
import User from '../models/User'

export const validateSocketToken = async (token: string): Promise<string> => {
    if (!token) return "404"
    try {
        const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY_AUTH || '')
        const user: any = await User.findById({ _id: decoded.user_id }).exec()
        if (user.length !== 0 && user.is_verified == true) {
            return decoded.user_id;
        }
        return "401"
    } catch (error) {
        return "Something went wrong";
    }
}