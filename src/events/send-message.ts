import { Socket, Server } from "socket.io";
import * as request from 'request'

const sendMessage = (_socket: Socket, io: Server, data: any) => {
  request.get(`http://localhost:8080/sockets?userId=${data.recieverId}`, (err: any, _response: any, body: any) => {
    if (!err) {
      const parsedBody = JSON.parse(body);

      if (parsedBody.length !== 0 && parsedBody[0] && parsedBody[0].socketId) {
        io.to(parsedBody[0].socketId).emit('message:recieved', data);
      } else {
        request.get(`http://localhost:8080/sockets?recieverId=${data.recieverId}`, (err: any, _response: any, body: any) => {
          if (!err) {
            const parsedBody = JSON.parse(body);

            if (parsedBody.length !== 0 && parsedBody[0] && parsedBody[0].socketId) {
              io.to(parsedBody[0].socketId).emit('message:recieved', data);
            }
          }
        });
      }
    }
  });
}

export { sendMessage };
