import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import AppError from './errors/appError';
import globalErrorHandler from './errors/errorController';
import CodeExerciseRouter from './routes/CodeExerciseRouter';
import { allowCors } from './utils/middlewareUtils';
import initSocketServer from './socketIo';

const app = express();
app.use(cors());
app.use(allowCors);
app.use(
  express.json({
    limit: '10kb',
  })
);

const port = +process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT'],
  },
});

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then(() => console.log('DB connection successful'));

initSocketServer(server, io);

app.use('/api/code-exercise', CodeExerciseRouter);

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

export default server;
