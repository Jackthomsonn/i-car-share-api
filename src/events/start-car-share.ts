import { Socket } from "socket.io";

const startCarShare = (socket: Socket, data: any) => {
  socket.join(data.carShareId, () => {
    // Send notification at this point
  });
}

export { startCarShare }