import GameManager from "../managers/GameManager";
import RoomManager from "../managers/RoomManager";
import {
    Vector2d,
    diagCollide,
    quadColliderMesh,
    satCollide,
    updateShape,
} from "../modules/SAT";
import Player from "../room/Player";
import GameObject from "./GameObject";
import { Spell } from "./Spells/Spells";
import { HeavyWeapon } from "./Weapon";

export class TankBody extends GameObject {
    posX: number;
    posY: number;
    rotation: number;
    _type: "heavy" | "engeenier" | "test";
    player: Player;
    spells: Array<Spell>;
    hp: number;
    maxHp: number;

    constructor(_type: "heavy" | "engeenier" | "test", player: Player) {
        super();
        this.posX = 0;
        this.posY = 0;
        this.rotation = 0;
        this._type = _type;
        this.player = player;
        this.spells = [];
        this.hp = 100;
        this.maxHp = 100;
    }

    decraseHp(damage: number) {
        //TODO: decrase hp function
        this.hp -= damage;

        if (this.hp < 0) {
            this.hp = this.maxHp;
            this.posX = 0;
            this.posY = 0;
        }
    }

    networkData() {
        return {};
    }

    useSpell(data: any) {}

    networkController(data: {
        rotate: "LEFT" | "RIGHT" | "NONE";
        movement: "UP" | "DOWN" | "NONE";
    }) {}
}

export class HeavyTankBody extends TankBody {
    posX: number;
    posY: number;
    rotation: number;
    rotationSpeed: number;
    maxSpeed: number;
    minSpeed: number;
    speed: number;
    engine: "UP" | "DOWN" | "OFF";
    width: number = 116;
    height: number = 75;
    pushSpeed: number = 1.12;
    standartPushSpeed: number = 10;
    weapon: HeavyWeapon;
    networkRotate: "LEFT" | "RIGHT" | "NONE";
    networkMovement: "UP" | "DOWN" | "NONE";
    collision: boolean;

    constructor(player: Player) {
        super("heavy", player);
        this.speed = 0;
        this.hp = 80;
        this.maxHp = 100;
        this.maxSpeed = 20;
        this.rotationSpeed = 0.115;
        this.posX = 1110;
        this.posY = 1000;
        this.rotation = 0.03;
        this.minSpeed = -10;
        this.engine = "OFF";
        this._type = "heavy";
        this.networkRotate = "NONE";
        this.networkMovement = "NONE";
        this.collidingProps = {
            activeShape: [],
            shape: quadColliderMesh(this.width, this.height),
        };
        this.weapon = new HeavyWeapon(this);
        this.collision = false;
    }

    update(deltaTime: number) {
        const tempPosX = this.posX;
        const tempPosY = this.posY;
        const tempRotation = this.rotation;

        let rotationCollision = false;

        this.posX += Math.cos(this.rotation) * this.speed * deltaTime;
        this.posY += Math.sin(this.rotation) * this.speed * deltaTime;

        this.collision = false;
        if (this.collidingProps != null) {
            this.collidingProps.activeShape = updateShape(
                this.posX + this.width / 2,
                this.posY + this.height / 2,
                this.rotation,
                this.collidingProps.shape
            );

            if (this.player.roomCode) {
                const room = RoomManager.getRoomByCode(this.player.roomCode);

                if (room != undefined) {
                    const gameObjects = [
                        ...room.gameManager.gameObjects.tankBodies,
                    ];

                    for (let go of gameObjects) {
                        if (go.id == this.id) continue;
                        if (go.collidingProps == null) continue;

                        let collide = satCollide(
                            this.collidingProps.activeShape,
                            go.collidingProps.activeShape
                        );
                        if (collide) {
                            this.collision = true;
                            // this.posX = tempPosX;
                            this.speed = 1;
                            // this.posY = tempPosY;
                            this.speed = 0;
                        }

                        const polygon1 = {
                            posX: this.posX,
                            posY: this.posY,
                            polygon: this.collidingProps.activeShape,
                        };

                        const polygon2 = {
                            posX: go.posX,
                            posY: go.posY,
                            polygon: go.collidingProps.activeShape,
                        };

                        diagCollide(polygon1, polygon2);
                        // if (collide) continue;

                        // (this.targetX - this.posX) * coef
                        this.posX = polygon1.posX;
                        this.posY = polygon1.posY;

                        // go.posX = polygon2.posX;
                        // go.posY = polygon2.posY;

                        // this.collision = collide;
                    }
                }
            }
        }

        let pushRotationSpeed = this.rotationSpeed;
        // this.speed == 0
        //     ? this.rotationSpeed
        //     : this.rotationSpeed - this.speed / 100;

        // console.log(pushRotationSpeed);

        this.engine = "OFF";
        if (this.networkMovement == "UP") {
            if (this.maxSpeed > this.speed) {
                this.speed += this.pushSpeed;
                this.engine = "UP";
            }

            if (this.networkRotate == "LEFT") {
                this.rotation -= pushRotationSpeed * deltaTime;
            }
            if (this.networkRotate == "RIGHT") {
                this.rotation += pushRotationSpeed * deltaTime;
            }
        } else if (this.networkMovement == "DOWN") {
            if (this.minSpeed < this.speed) {
                this.speed -= this.pushSpeed;
                this.engine = "DOWN";
            }

            if (this.networkRotate == "LEFT") {
                this.rotation += pushRotationSpeed * deltaTime;
            }
            if (this.networkRotate == "RIGHT") {
                this.rotation -= pushRotationSpeed * deltaTime;
            }
        } else {
            if (this.networkRotate == "LEFT") {
                this.rotation -= pushRotationSpeed * deltaTime;
            }
            if (this.networkRotate == "RIGHT") {
                this.rotation += pushRotationSpeed * deltaTime;
            }
        }

        // if (CanvasManager.keyDown("p")) {
        //     this.posX = 0;
        //     this.posY = 0;
        // }

        if (this.collidingProps != null) {
            this.collidingProps.activeShape = updateShape(
                this.posX + this.width / 2,
                this.posY + this.height / 2,
                this.rotation,
                this.collidingProps.shape
            );

            if (this.player.roomCode) {
                const room = RoomManager.getRoomByCode(this.player.roomCode);

                if (room != undefined) {
                    const tankBodies = room?.players.map((player) =>
                        player.id == this.player.id ? null : player.tankBody
                    );

                    for (let go of tankBodies) {
                        if (go == null) continue;
                        if (go.collidingProps == null) return;

                        let collide = satCollide(
                            this.collidingProps.activeShape,
                            go.collidingProps.activeShape
                        );
                        if (collide) {
                            this.rotation = tempRotation;
                            break;
                        }
                    }
                }
            }
        }

        //debug
        // this.rotation = tempRotation;

        if (this.engine == "OFF") {
            if (this.speed > 0) {
                this.speed -= this.pushSpeed;
            } else if (this.speed < 0) {
                this.speed += this.pushSpeed;
            }
        }

        this.weapon.update(deltaTime);
    }

    networkController(data: {
        rotate: "LEFT" | "RIGHT" | "NONE";
        movement: "UP" | "DOWN" | "NONE";
        weapon: {
            dx: number;
            dy: number;
        };
    }) {
        this.networkRotate = data.rotate;
        this.networkMovement = data.movement;
        this.weapon.networkController(data.weapon);
    }

    useSpell(data: any) {
        const { spellType } = data;

        const spell = this.spells.find((sp) => sp.spellType == spellType);

        if (spell != undefined) return;

        this.weapon.useSpell(data);
    }

    networkData() {
        return {
            id: this.id,
            posX: this.posX,
            posY: this.posY,
            rotation: this.rotation,
            hp: this.hp,
            maxHp: this.maxHp,
            weapon: this.weapon.network(),
            playerId: this.player.id,
            gameObjectType: "TankBody",
            _type: this._type,
            collision: this.collision,
            spells: this.spells.map((spell) => spell.network()),
        };
    }
}

export class EngeenierTankBody extends TankBody {
    width: number;
    height: number;
    constructor(player: Player) {
        super("engeenier", player);
        this.width = 0;
        this.height = 0;
    }
}
