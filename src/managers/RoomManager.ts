import { Server } from "socket.io";
import Player from "../room/Player";
import Room from "../room/Room";

class RoomManager {
  rooms: Array<Room> = [];
  players: Array<Player> = [];

  constructor() {}

  getPlayer(id: string) {}

  getPlayerIdByToken(token: string) {}

  getRoomByCode(roomCode: string): Room | undefined {
    return this.rooms.find((r) => r.roomCode == roomCode);
  }

  join(roomCode: string, player: Player): boolean {
    const room = this.getRoomByCode(roomCode);

    if (room == undefined) return false;

    this.rooms.map((r) => r.removePlayer(player.socket.id));

    room.joinRoom(player);

    return true;
  }

  create(roomCode: string, io: Server): Room {
    const newRoom = new Room(roomCode, io);
    this.rooms.push(newRoom);
    return newRoom;
  }
}

export default new RoomManager();
