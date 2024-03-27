import { Socket } from "socket.io";

class Player {
  socket: Socket;
  username: string;
  token: string;

  constructor(socket: Socket, username: string, token: string) {
    this.socket = socket;
    this.username = username;
    this.token = token;
  }

  networkData() {
    return {
      socketId: this.socket.id,
      username: this.username,
    };
  }
}

export default Player;
