import express from 'express';
import http from "node:http"
import cors from 'cors';
import { Server } from 'socket.io';
import sequelize from './config/database';
import morgan from "morgan";
import { env } from './config/env';




import authRoutes from './routes/authRoutes';
import channelRoutes from './routes/channelRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';
import fileRoutes from "./routes/fileRoutes";
import socketHandler from './socket/socket';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: env.allowed_origin,
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: env.allowed_origin,
    methods: "*",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/channels', channelRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/files', fileRoutes);


socketHandler(io);

// Test route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
});

app.use(morgan(env.node_env === "prod" ? "combined" : "dev"));
const PORT = env.port || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync(process.env.NODE_ENV !== 'prod' ? { alter: true } : undefined);

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
