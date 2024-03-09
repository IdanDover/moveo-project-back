import { Server } from 'socket.io';

export default function initSocketServer(server: any, io: Server) {
  io.on('connection', (socket) => {
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
    });

    socket.on('sendCode', (data: { room: string; code: string }) => {
      if (!socket.rooms.has(data.room)) {
        return;
      }

      socket.to(data.room).emit('receiveCode', data.code);
    });

    socket.on('leaveRoom', (roomName) => {
      if (!socket.rooms.has(roomName)) {
        return;
      }

      socket.leave(roomName);
    });
  });
}
