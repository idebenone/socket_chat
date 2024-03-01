import { Socket } from "socket.io-client";

export const startChat = (data: { socket: Socket, room: string }) => {
    data.socket.emit("start_chat", { room: data.room });
}

export const sendChat = (data: { socket: Socket, message: string, senderId: string, receiverId: string, parent: string, room: string }) => {
    data.socket.emit("send_chat", { message: data.message, senderId: data.senderId, receiverId: data.receiverId, parent: data.parent, room: data.room });
}

export const sendNotification = (data: { socket: Socket, sender: string, receiver: string, username: string, name: string, type: string, description: string, message: string }) => {
    data.socket.emit(`send-notifications-${data.sender}`, { receiver: data.receiver, username: data.username, name: data.name, type: data.type, description: data.description, message: data.message });
} 