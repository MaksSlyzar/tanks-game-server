import { Socket } from "socket.io";
import {
    EngeenierTankBody,
    HeavyTankBody,
    TankBody,
} from "../GameObjects/TankBody";
import Room from "../room/Room";
import GameObject from "../GameObjects/GameObject";
import { BaseBuild, Build } from "../GameObjects/Builds/Builds";
import { Enemy, TestEnemy } from "../GameObjects/Enemies/Enemies";
import { diagCollide, satCollide } from "../modules/SAT";

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
        builds: Array<Build>;
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
            builds: [],
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

        const baseBuild = new BaseBuild();
        this.gameObjects.enemies.push(new TestEnemy(baseBuild));
        this.gameObjects.builds.push(baseBuild);

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
                    builds: this.gameObjects.builds.map((build) =>
                        build.network()
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
                    builds: this.gameObjects.builds.map((build) =>
                        build.network()
                    ),
                },
            });
    }

    collision() {
        const collidingGameObjects = [
            ...this.gameObjects.builds.filter(
                (_build) => _build.collidingProps != null
            ),
            ...this.gameObjects.enemies.filter(
                (_enemy) => _enemy.collidingProps != null
            ),
            ...this.gameObjects.tankBodies.filter(
                (_tankBody) => _tankBody.collidingProps != null
            ),
        ];

        collidingGameObjects.forEach((gameObject) => {
            if (gameObject.collidingProps == null) return;

            for (let testCollide of collidingGameObjects) {
                if (testCollide.id == gameObject.id) return;
                if (testCollide.collidingProps == null) continue;

                let collide = satCollide(
                    gameObject.collidingProps.activeShape,
                    testCollide.collidingProps.activeShape
                );

                if (!collide) return;

                // diagCollide(polygon1, polygon2);

                gameObject.onCollide(0, 0, testCollide);
                testCollide.onCollide(0, 0, gameObject);
            }
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

        this.collision();

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
                builds: this.gameObjects.builds.map((build) => build.network()),
            },
        });

        this.lastDate = this.currentTime;
        setTimeout(() => this.update(), 10);
    }
}

export default GameManager;
