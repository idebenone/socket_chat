import express, { Express } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from "cors";
import morgan from "morgan";
import http from "http";
import path from 'path';
import auth from "./routes/Auth";

import { Server } from "socket.io";
import { saveMessage } from './services/messageService';

const app: Express = express();
const port = 3001;
const server = http.createServer(app);

const DB_URI = "mongodb://localhost:27017"
const options: ConnectOptions = {
    dbName: "socket_chat",
}

const io = new Server(server, {
    cors: {
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(DB_URI, options).then(() => {
    console.log(`⚡ | Database connection successful`);
}).catch((error) => {
    console.log(error);
})

let chatRoom = '';
let allUsers: any[] = [];

io.on("connection", (socket) => {
    socket.on('join_room', (data) => {
        const { username, room } = data;
        socket.join(room);
        let __createdtime__ = Date.now();
        socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: "CHAT_BOT",
            __createdtime__
        })
        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: "CHAT_BOT",
            __createdtime__,
        });
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        const chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
    })

    socket.on("private", (data) => {
        const { user, room } = data;
        socket.join(room);
    })

    socket.on("send_message", async (data) => {
        const { message, username, room, liked } = data;
        io.in(room).emit('receive_message', data);
        await saveMessage(data);
    })

    socket.on('leave_room', (data) => {
        const { username, room } = data;
        socket.leave(room);
        const __createdtime__ = Date.now();
        allUsers = allUsers.filter((user) => user.username !== username);
        socket.to(room).emit('chatroom_users', allUsers);
        socket.to(room).emit('receive_message', {
            username: "CHAT_BOT",
            message: `${username} has left the chat`,
            __createdtime__,
        });
        console.log(`${username} has left the chat`);
    });

})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/auth", auth)

server.listen(port, () => console.log(`⚡ | Server is running at http://localhost:${port}`));

