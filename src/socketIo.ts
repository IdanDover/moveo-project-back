import { Server } from 'socket.io';

export default function initSocketServer(server: any, io: Server) {
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('joinRoom', async (roomName) => {
      const socketsLength = (await io.in(roomName).fetchSockets()).length;

      if (socketsLength >= 2) {
        return;
      }

      socket.emit(
        'receiveRole',
        socketsLength === 0 ? 'instructor' : 'student' // the first to join is an instructor and the second is a student
      );
      socket.join(roomName);
      console.log(`socket ${socket.id} joined room: ${roomName}`);
    });

    socket.on('sendCode', (data: { room: string; code: string }) => {
      if (!socket.rooms.has(data.room)) {
        return;
      }
      socket.to(data.room).emit('receiveCode', data.code);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnect', socket.id);
    });
  });
}
