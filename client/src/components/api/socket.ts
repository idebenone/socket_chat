import { Socket } from "socket.io-client";

export const startChat = (data: { socket: Socket, room: string }) => {
    data.socket.emit("start_chat", { room: data.room });
}

export const sendChat = (data: { socket: Socket, message: string, senderId: string, receiverId: string, parent: string, room: string }) => {
    data.socket.emit("send_chat", { message: data.message, senderId: data.senderId, receiverId: data.receiverId, parent: data.parent, room: data.room });
}

export const closeMessageConnection = (data: { socket: Socket }) => {
    data.socket.off("receive_chat");
}