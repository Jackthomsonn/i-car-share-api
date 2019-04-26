import { Server } from "socket.io";
import { joinCarShare } from '../events/join-car-share';
import { leaveCarShare } from "../events/leave-car-share";
import { locationUpdate } from "../events/location-update";
import { sendMessage } from "../events/send-message";
import { startCarShare } from '../events/start-car-share';

const socket = (io: Server) => {
  io.on('connection', (socketInstance: any) => {
    socketInstance.on('client:connected', (data: any) => {
      socketInstance.userId = data.userId;

      socketInstance.emit('client:information', {
        socketId: socketInstance.id
      })
    });

    socketInstance.on('disconnect', () => { });

    socketInstance.on('start:carShare', startCarShare.bind(null, socketInstance));

    socketInstance.on('join:carShare', joinCarShare.bind(null, socketInstance));

    socketInstance.on('leave:carShare', leaveCarShare.bind(null, socketInstance));

    socketInstance.on('location:update', locationUpdate.bind(null, socketInstance));

    socketInstance.on('message:send', sendMessage.bind(null, socketInstance, io));
  });
}

export { socket };

