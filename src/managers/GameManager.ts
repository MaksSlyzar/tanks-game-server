import { Socket } from "socket.io";
import {
    EngeenierTankBody,
    HeavyTankBody,
    TankBody,
} from "../GameObjects/TankBody";
import Room from "../room/Room";
import GameObject from "../GameObjects/GameObject";

class GameManager {
    room: Room;
    currentTime: Date;
    diff: number;
    deltaTime: number;
    lastDate: Date;
    gameObjects: {
        tankBodies: Array<TankBody>;
        projectiles: Array<GameObject>;
        enemies: Array<GameObject>;
    };

    constructor(room: Room) {
        this.room = room;

        this.currentTime = new Date();
        this.diff = 0;
        this.deltaTime = 0;
        this.lastDate = new Date();
        this.gameObjects = {
            tankBodies: [],
            projectiles: [],
            enemies: [],
        };
    }

    generateTanks() {
        this.room.players.forEach((player, index) => {
            switch (player.gameRole) {
                case "engeenier":
                    player.tankBody = new EngeenierTankBody(player);
                    break;

                case "heavy":
                    player.tankBody = new HeavyTankBody(player);
                    break;
            }

            if (player.tankBody != null) {
                player.tankBody.posY = index * 200;
                this.gameObjects.tankBodies.push(player.tankBody);
            }
        });

        this.room.players.map((pl) => (pl.gameSession = "playing"));

        this.createGameObjectsEvent(null);
        this.update();
    }

    createGameObjectsEvent(socket: null | Socket) {
        const playersData = this.room.players.map((player) =>
            player.networkData()
        );

        if (socket == null)
            this.room.io.to(this.room.roomCode).emit("createGameObjects", {
                players: playersData,
                gameObjects: {
                    enemies: this.gameObjects.enemies.map((gameObject) =>
                        gameObject.network()
                    ),
                    tankBodies: this.gameObjects.tankBodies.map((tankBody) =>
                        tankBody.networkData()
                    ),
                    projectiles: this.gameObjects.projectiles.map(
                        (projectile) => projectile.network()
                    ),
                },
            });
        else
            socket.emit("createGameObjects", {
                players: playersData,
                gameObjects: {
                    enemies: this.gameObjects.enemies.map((gameObject) =>
                        gameObject.network()
                    ),
                    tankBodies: this.gameObjects.tankBodies.map((tankBody) =>
                        tankBody.networkData()
                    ),
                    projectiles: this.gameObjects.projectiles.map(
                        (projectile) => projectile.network()
                    ),
                },
            });
    }

    update() {
        this.currentTime = new Date();
        this.diff =
            this.currentTime.getTime() / 1000 - this.lastDate.getTime() / 1000;
        this.deltaTime = this.diff * 10;
        this.lastDate = this.currentTime;

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
                enemies: this.gameObjects.enemies.map((gameObject) =>
                    gameObject.network()
                ),
                tankBodies: this.gameObjects.tankBodies.map((tankBody) =>
                    tankBody.networkData()
                ),
                projectiles: this.gameObjects.projectiles.map((projectile) =>
                    projectile.network()
                ),
            },
        });
        setTimeout(() => this.update(), 10);
    }
}

export default GameManager;
