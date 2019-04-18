import { Socket } from "socket.io";

const leaveCarShare = (socket: Socket, data: any) => {
  console.log('Socket left car share: ' + socket.id);
  socket.leave(data.carShareId);
}

export { leaveCarShare };

