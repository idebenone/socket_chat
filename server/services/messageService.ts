import { Types } from 'mongoose';

import Message from "../models/Message";

export const saveMessage = async ({ senderId, receiverId, room, message, parent }: { senderId: string, receiverId: string, room: string, message: string, parent: string }) => {
    if (!senderId || !receiverId || !room || !message) console.log("Some parameters are missing");
    try {
        const messageData: any = {
            participants: [
                { user: new Types.ObjectId(senderId), role: 'sender' },
                { user: new Types.ObjectId(receiverId), role: 'receiver' }
            ],
            room,
            message
        };

        if (parent) messageData.parent = new Types.ObjectId(parent);

        const newMessage = new Message(messageData)
        await newMessage.save();
    } catch (error) {
        console.log(error)
    }
}