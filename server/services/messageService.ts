import Message from "../models/Message";

export const saveMessage = async ({ user, message, parent, liked }: any) => {
    try {
        const newMessage = new Message({ user, message, parent, liked })
        await newMessage.save();
    } catch (error) {
        console.log(error)
    }
}