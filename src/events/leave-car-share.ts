import { Socket } from "socket.io";

const leaveCarShare = (socket: Socket, data: any) => {
  socket.leave(data.carShareId);
}

export { leaveCarShare };

