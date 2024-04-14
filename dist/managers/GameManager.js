"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TankBody_1 = require("../GameObjects/TankBody");
class GameManager {
    constructor(room) {
        this.gameObjects = [];
        this.room = room;
        this.currentTime = new Date();
        this.diff = 0;
        this.deltaTime = 0;
        this.lastDate = new Date();
        this.generateTanks();
    }
    generateTanks() {
        this.room.players.forEach((player, index) => {
            switch (player.gameRole) {
                case "engeenier":
                    player.tankBody = new TankBody_1.EngeenierTankBody("engeenier", player);
                    break;
                case "heavy":
                    player.tankBody = new TankBody_1.HeavyTankBody(player);
                    break;
            }
            if (player.tankBody != null)
                player.tankBody.posY = index * 200;
        });
        this.room.players.map(pl => pl.gameSession = "playing");
        this.createGameObjectsEvent(null);
        this.update();
    }
    createGameObjectsEvent(socket) {
        const playersData = this.room.players.map(player => player.networkData());
        if (socket == null)
            this.room.io.to(this.room.roomCode).emit("createGameObjects", { players: playersData, gameObjects: [] });
        else
            socket.emit("createGameObjects", { players: playersData, gameObjects: [] });
    }
    update() {
        this.currentTime = new Date();
        this.diff = this.currentTime.getTime() / 1000 - this.lastDate.getTime() / 1000;
        this.deltaTime = this.diff * 10;
        this.lastDate = this.currentTime;
        this.room.players.map(player => { var _a; return (_a = player.tankBody) === null || _a === void 0 ? void 0 : _a.update(this.deltaTime); });
        this.room.io.to(this.room.roomCode).emit("sendSyncData", { players: this.room.players.map(player => player.networkData()) });
        setTimeout(() => this.update(), 10);
    }
}
exports.default = GameManager;
