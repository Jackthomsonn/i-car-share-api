import { Socket } from "socket.io";

const joinCarShare = (socket: Socket, data: any) => {
  socket.join(data.carShareId, () => { });
}

export { joinCarShare };
