import { Socket } from "socket.io";

const joinCarShare = (socket: Socket, data: any) => {
  console.log('Someone joined the car share: ' + data.carShareId);
  socket.join(data.carShareId, () => { });
}

export { joinCarShare };
