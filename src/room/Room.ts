import { Server } from "socket.io";
import Player from "./Player";

class Room {
    roomCode: string;
    players: Array<Player>;
    io: Server;

    constructor (roomCode: string, io: Server) {
        this.roomCode = roomCode;
        this.players = [];
        this.io = io;
    }

    removePlayer (socketId: string) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].socket.id == socketId) {
                this.players.splice(i, 1);
                this.io.to(this.roomCode).emit("updatePlayerList", { players: this.players.map(p => p.networkData())} );
                return true;
            }
        }

        return false;
    }

    joinRoom (player: Player) {
        this.players.push(player);
        player.socket.join(this.roomCode);
        console.log(this.players.map(p => p.networkData()))
        this.io.to(this.roomCode).emit("updatePlayerList", { players: this.players.map(p => p.networkData())} );
    }
}

export default Room;