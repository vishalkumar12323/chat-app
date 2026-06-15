import express from 'express';
import http from "node:http"
import cors from 'cors';
import { Server } from 'socket.io';
import sequelize from './config/database';
import * as dotenv from "dotenv";
import morgan from "morgan"

dotenv.config();



import authRoutes from './routes/authRoutes';
import channelRoutes from './routes/channelRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';
import socketHandler from './socket/socket';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN,
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: "*",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);


socketHandler(io);

// Test route
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
});

app.use(morgan("dev"));
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync();

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
