import { Router, Request, Response, NextFunction } from 'express';

import Message from "../models/Message";

import response from '../utilities/response';

const message = Router();

message.get("/:senderId/:receiverId", async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.params;
    if (!senderId || !receiverId) return res.status(422).json(response.MISSING);
    try {
        const messages = await Message.find({
            $or: [
                { participants: { $elemMatch: { user: senderId, role: 'sender' } } },
                { participants: { $elemMatch: { user: senderId, role: 'receiver' } } },
                { participants: { $elemMatch: { user: receiverId, role: 'sender' } } },
                { participants: { $elemMatch: { user: receiverId, role: 'receiver' } } }
            ]
        }).select({ 'participants.user': 1, message: 1, room: 1, created_at: 1, modified_at: 1, _id: 0 }).sort({ created_at: 1 });

        if (!messages) return res.status(404).json(response.NOT_FOUND);
        return res.status(200).json(response.OK(messages));
    } catch (error) {
        return res.status(501).json(response.SYSTEM_ERROR);
    }
})

export default message;
