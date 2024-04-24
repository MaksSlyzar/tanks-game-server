"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TankBody_1 = require("../GameObjects/TankBody");
const Builds_1 = require("../GameObjects/Builds/Builds");
const Enemies_1 = require("../GameObjects/Enemies/Enemies");
class GameManager {
    constructor(room) {
        this.room = room;
        this.currentTime = new Date();
        this.diff = 0;
        this.deltaTime = 0;
        this.lastDate = new Date();
        this.gameObjects = {
            tankBodies: [],
            projectiles: [],
            enemies: [],
            builds: [],
        };
    }
    generateTanks() {
        this.room.players.forEach((player, index) => {
            switch (player.gameRole) {
                case "engeenier":
                    player.tankBody = new TankBody_1.EngeenierTankBody(player);
                    break;
                case "heavy":
                    player.tankBody = new TankBody_1.HeavyTankBody(player);
                    break;
            }
            if (player.tankBody != null) {
                player.tankBody.posY = index * 200;
                this.gameObjects.tankBodies.push(player.tankBody);
            }
        });
        const baseBuild = new Builds_1.BaseBuild();
        this.gameObjects.enemies.push(new Enemies_1.TestEnemy(baseBuild));
        this.gameObjects.builds.push(baseBuild);
        this.room.players.map((pl) => (pl.gameSession = "playing"));
        this.createGameObjectsEvent(null);
        this.update();
    }
    createGameObjectsEvent(socket) {
        const playersData = this.room.players.map((player) => player.networkData());
        if (socket == null)
            this.room.io.to(this.room.roomCode).emit("createGameObjects", {
                players: playersData,
                gameObjects: {
                    enemies: this.gameObjects.enemies.map((gameObject) => gameObject.network()),
                    tankBodies: this.gameObjects.tankBodies.map((tankBody) => tankBody.networkData()),
                    projectiles: this.gameObjects.projectiles.map((projectile) => projectile.network()),
                    builds: this.gameObjects.builds.map((build) => build.network()),
                },
            });
        else
            socket.emit("createGameObjects", {
                players: playersData,
                gameObjects: {
                    enemies: this.gameObjects.enemies.map((gameObject) => gameObject.network()),
                    tankBodies: this.gameObjects.tankBodies.map((tankBody) => tankBody.networkData()),
                    projectiles: this.gameObjects.projectiles.map((projectile) => projectile.network()),
                    builds: this.gameObjects.builds.map((build) => build.network()),
                },
            });
    }
    update() {
        this.currentTime = new Date();
        this.diff = this.currentTime.getTime() - this.lastDate.getTime();
        this.deltaTime = this.diff / 100;
        const gameObjects = [
            ...this.gameObjects.enemies,
            ...this.gameObjects.projectiles,
            ...this.gameObjects.tankBodies,
        ];
        gameObjects.map((go) => {
            go.update(this.deltaTime);
        });
        this.room.io.to(this.room.roomCode).emit("sendSyncData", {
            players: this.room.players.map((player) => player.networkData()),
            gameObjects: {
                enemies: this.gameObjects.enemies.map((gameObject) => gameObject.network()),
                tankBodies: this.gameObjects.tankBodies.map((tankBody) => tankBody.networkData()),
                projectiles: this.gameObjects.projectiles.map((projectile) => projectile.network()),
                builds: this.gameObjects.builds.map((build) => build.network()),
            },
        });
        this.lastDate = this.currentTime;
        setTimeout(() => this.update(), 10);
    }
}
exports.default = GameManager;
