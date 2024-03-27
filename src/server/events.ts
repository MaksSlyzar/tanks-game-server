import { Server, Socket } from "socket.io";
import Player from "../room/Player";
import RoomManager from "../managers/RoomManager";

export interface IOEvent {
  execute(socket: Socket, io: Server, data: any): boolean;
}

interface EventsPair {
  [key: string]: IOEvent;
}

function generateToken() {
  return String(Math.round(Math.random() * 1000000));
}

export const events: EventsPair = {
  connection: {
    execute(socket: Socket, io: Server, data: any) {
      console.log("Client connection, socket id:", socket.id);
      return true;
    },
  },
  createRoom: {
    execute(socket: Socket, io: Server, data: any) {
      const player = new Player(socket, data.username, generateToken());
      RoomManager.create(data.lobbyCode, io);
      RoomManager.join(data.lobbyCode, player);
      return true;
    },
  },
  joinRoom: {
    execute(socket: Socket, io: Server, data: any) {
      socket.data = {
        username: data.username,
      };
      const player = new Player(socket, data.username, generateToken());
      RoomManager.join(data.lobbyCode, player);

      // io.to(data.lobbyCode).emit("", "world");
      return true;
    },
  },
  disconnect: {
    execute(socket, io, data) {
      console.log("disconnection", socket.id);
      return true;
    },
  },
};
