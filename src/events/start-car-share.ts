import { Socket } from "socket.io";

const startCarShare = (socket: Socket, data: any) => {
  // Before joining, check the user owns this car Share

  console.log('Car share started: ' + data.carShareId);

  socket.join(data.carShareId, () => {
    // Send notification at this point
  });
}

export { startCarShare }