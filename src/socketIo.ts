import { Server } from 'socket.io';

export default function initSocketServer(server: any, io: Server) {
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('joinRoom', async (roomName) => {
      if (socket.rooms.has(roomName)) {
        return;
      }
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

    socket.on(
      'sendCode',
      (data: { room: string; role: string; code: string }) => {
        if (!socket.rooms.has(data.room)) {
          return;
        }

        if (data.role === 'instructor') {
          return;
        }

        socket.to(data.room).emit('receiveCode', data.code);
      }
    );

    socket.on('leaveRoom', (roomName) => {
      if (!socket.rooms.has(roomName)) {
        return;
      }
      console.log(`socket ${socket.id} left room: ${roomName}`);

      socket.leave(roomName);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnect', socket.id);
    });
  });
}
