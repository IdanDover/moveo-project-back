import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import AppError from './errors/appError';
import globalErrorHandler from './errors/errorController';
import CodeBlockRouter from './routes/CodeBlockRouter';
import { allowCors } from './utils/middlewareUtils';

const frontendUrl: string = process.env.FRONTEND_URL;

const app = express();
app.use(cors());

app.use(allowCors);

const port = +process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT'],
  },
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(socket.rooms);

    console.log(`socket ${socket.id} joined room: ${roomName}`);
  });

  socket.on('changedCode', (data: { room: string; code: string }) => {
    socket.to(data.room).emit(data.code);
  });

  socket.on('disconnect', () => {
    console.log('socket disconnect', socket.id);
  });
});

app.use('/api/codeblock', CodeBlockRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});

process.on('uncaughtException', (err) => {
  console.log(`${err.name} : ${err.message}`);
  console.log('UNCAUGHT EXCEPTION 💥 Shutting down...');
  process.exit(1);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Error name-${err.name} : Error message-${err.message}`);
  console.log('UNHANDLER REJECTION 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
