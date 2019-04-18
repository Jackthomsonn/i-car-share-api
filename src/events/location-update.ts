import { Socket } from "socket.io";

const locationUpdate = (socket: Socket, data: any) => {
  console.log('Location updated: ' + data.coordinates.coordinates);

  socket.to(data.carShareId).emit('host:location', {
    location: data.coordinates.coordinates
  });
}

export { locationUpdate };

