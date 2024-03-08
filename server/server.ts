import express, { Express } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import path from 'path';

import { validateSocketToken } from "./middleware/socketToken";
import auth from "./routes/Auth";
import user from "./routes/User";
import message from "./routes/Message";
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

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
        const user_id = await validateSocketToken(token);
        if (user_id !== "401") next();
    } catch (error) {
        console.log(error);
    }
})

io.on("connection", (socket) => {
    let query = socket.handshake.query;

    socket.on(`send-notifications-${query.user}`, (data) => {
        io.emit(`receive-notifications-${data.receiver}`, data);
    })

    socket.on('start_chat', (data) => {
        const { room } = data;
        socket.join(room);
    })

    socket.on("send_chat", async (data) => {
        const { message, senderId, receiverId, room, parent } = data;
        let newMessage = {
            message: data.message,
            participants: [{ user: data.senderId }, { user: data.receiverId }],
            room: data.room,
            parent: data.parent,
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString()
        }
        await saveMessage({ senderId, receiverId, room, message, parent });
        io.in(room).emit('receive_chat', newMessage);
    })
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/auth", auth)
app.use("/user", user);
app.use("/message", message);

server.listen(port, () => console.log(`⚡ | Server is running at http://localhost:${port}`));

