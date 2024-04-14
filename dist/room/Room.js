"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameManager_1 = __importDefault(require("../managers/GameManager"));
class Room {
    constructor(roomCode, io) {
        this.gameManager = null;
        this.roomCode = roomCode;
        this.players = [];
        this.io = io;
        this.leaderPlayerId = "";
    }
    removePlayer(socketId) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].socket.id == socketId) {
                this.players.splice(i, 1);
                this.io.to(this.roomCode).emit("updatePlayerList", { players: this.players.map(p => p.networkData()) });
                return true;
            }
        }
        return false;
    }
    joinRoom(player) {
        this.players.push(player);
        player.socket.join(this.roomCode);
        player.roomReady = false;
        this.updateRoomViewData();
    }
    updateRoomViewData() {
        this.io.to(this.roomCode).emit("updateRoomViewData", this.networkData());
    }
    startGame() {
        this.gameManager = new GameManager_1.default(this);
    }
    networkData() {
        return {
            roomName: this.roomCode,
            players: this.players.map(player => player.networkData())
        };
    }
}
exports.default = Room;
