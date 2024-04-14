import { Server } from "socket.io";
import Player from "./Player";
import GameManager from "../managers/GameManager";

class Room {
    roomCode: string;
    players: Array<Player>;
    io: Server;
    leaderPlayerId: string;
    gameManager: GameManager;
    roomType: "Normal"|"Testing";

    constructor (roomCode: string, io: Server) {
        this.roomCode = roomCode;
        this.players = [];
        this.io = io;
        this.gameManager = new GameManager(this);
        this.roomType = "Normal";
        this.leaderPlayerId = "";
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

    joinRoom (player: Player): void {
        this.players.push(player);
        player.socket.join(this.roomCode);
        player.roomReady = false;
        this.updateRoomViewData();
    }

    updateRoomViewData () {
        this.io.to(this.roomCode).emit("updateRoomViewData", this.networkData());
    }

    startGame () {
        this.gameManager.generateTanks();
    }

    networkData () {
        return {
            roomName: this.roomCode,
            players: this.players.map(player => player.networkData()),
            roomType: this.roomType
        }
    }
}

export default Room;