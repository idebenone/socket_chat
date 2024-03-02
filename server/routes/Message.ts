import { Router, Request, Response, NextFunction } from 'express';
import Message from "../models/Message";
import response from '../utilities/response';
import { validate } from '../middleware/token';
import { Types } from 'mongoose';

const message = Router();
message.use(validate);

message.get("/:senderId/:receiverId", async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.params;
    if (!senderId || !receiverId) return res.status(422).json(response.MISSING);
    try {
        const messages = await Message.find({
            $or: [
                {
                    $and: [
                        { participants: { $elemMatch: { user: senderId, role: 'sender' } } },
                        { participants: { $elemMatch: { user: receiverId, role: 'receiver' } } }
                    ]
                },
                {
                    $and: [
                        { participants: { $elemMatch: { user: senderId, role: 'receiver' } } },
                        { participants: { $elemMatch: { user: receiverId, role: 'sender' } } }
                    ]
                }
            ]
        }).select({ 'participants.user': 1, message: 1, room: 1, created_at: 1, modified_at: 1, _id: 0 }).sort({ created_at: 1 });
        return res.status(200).json(response.OK(messages));
    } catch (error) {
        return res.status(501).json(response.SYSTEM_ERROR);
    }
})

message.get("/recents", async (req: Request, res: Response) => {
    try {
        const recentMessages = await Message.aggregate([
            {
                $match: {
                    'participants.user': new Types.ObjectId(res.locals.user_id as string)
                }
            },
            { $sort: { room: 1, created_at: -1 } },
            {
                $group: {
                    _id: "$room",
                    recentMessage: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$recentMessage" } },
            {
                $lookup: {
                    from: "users",
                    localField: "participants.user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $match: {
                    'user._id': { $ne: new Types.ObjectId(res.locals.user_id as string) }
                }
            },
            {
                $project: {
                    participants: 0,
                    liked: 0,
                    modified_at: 0,
                    'user.email': 0,
                    'user.password': 0,
                    'user.otp': 0,
                    'user.is_verified': 0,
                    'user.followers_count': 0,
                    'user.following_count': 0,
                    'user.created_at': 0,
                    'user.modified_at': 0,
                }
            }
        ]).sort({ created_at: -1 });

        res.status(200).json(response.OK(recentMessages));

    } catch (error) {
        return res.status(501).json(response.SYSTEM_ERROR);
    }
})

export default message;
