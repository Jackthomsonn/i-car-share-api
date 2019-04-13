import { Server, Socket } from "socket.io";
import { leaveCarShare } from "../events/leave-car-share";
import { locationUpdate } from "../events/location-update";
import { joinCarShare } from '../events/join-car-share';
import { startCarShare } from '../events/start-car-share';

const socket = (io: Server) => {
  io.on('connection', (socketInstance: Socket) => {
    socketInstance.on('disconnect', () => { });

    socketInstance.on('start:carShare', startCarShare.bind(null, socketInstance));

    socketInstance.on('join:carShare', joinCarShare.bind(null, socketInstance));

    socketInstance.on('leave:carShare', leaveCarShare.bind(null, socketInstance));

    socketInstance.on('location:update', locationUpdate.bind(null, socketInstance));
  });
}

export { socket };

