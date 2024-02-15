import express, { Express } from 'express';
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";

const app: Express = express();
const port = 3001;
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const io = new Server(server, {
    cors: {
        methods: ['GET', 'POST']
    }
});

let chatRoom = '';
let allUsers: any[] = [];

io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

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

    socket.on("send_message", (data) => {
        const { message, username, room, __createdtime__ } = data;
        io.in(room).emit('receive_message', data);
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

server.listen(port, () => console.log(`Server running on ${port}`));

