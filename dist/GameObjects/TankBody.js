"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngeenierTankBody = exports.HeavyTankBody = exports.TankBody = void 0;
const RoomManager_1 = __importDefault(require("../managers/RoomManager"));
const SAT_1 = require("../modules/SAT");
const GameObject_1 = __importDefault(require("./GameObject"));
const Weapon_1 = require("./Weapon");
class TankBody extends GameObject_1.default {
    constructor(_type, player) {
        super();
        this.posX = 0;
        this.posY = 0;
        this.rotation = 0;
        this._type = _type;
        this.player = player;
    }
    networkData() {
        return {};
    }
    networkController(data) {
    }
}
exports.TankBody = TankBody;
class HeavyTankBody extends GameObject_1.default {
    constructor(player) {
        super();
        this.width = 116;
        this.height = 75;
        this.pushSpeed = 1.12;
        this.standartPushSpeed = 10;
        this.player = player;
        this.speed = 0;
        this.hp = 100;
        this.maxHp = 100;
        this.maxSpeed = 20;
        this.rotationSpeed = 0.015;
        this.posX = 1110;
        this.posY = 1000;
        this.rotation = 0.03;
        this.minSpeed = -10;
        this.engine = "OFF";
        // this.weapon = new HeavyWeapon(this);
        // this.activeShape = [];
        // this.shape = quadColliderMesh(this.width, this.height);
        this.networkRotate = "NONE";
        this.networkMovement = "NONE";
        this.collidingProps = {
            activeShape: [],
            shape: (0, SAT_1.quadColliderMesh)(this.width, this.height)
        };
        this.weapon = new Weapon_1.HeavyWeapon(this);
    }
    update(deltaTime) {
        const tempPosX = this.posX;
        const tempPosY = this.posY;
        const tempRotation = this.rotation;
        let rotationCollision = false;
        this.posX += (Math.cos(this.rotation) * this.speed) * deltaTime;
        this.posY += (Math.sin(this.rotation) * this.speed) * deltaTime;
        if (this.collidingProps != null) {
            this.collidingProps.activeShape = (0, SAT_1.updateShape)(this.posX + this.width / 2, this.posY + this.height / 2, this.rotation, this.collidingProps.shape);
            if (this.player.roomCode) {
                const room = RoomManager_1.default.getRoomByCode(this.player.roomCode);
                if (room != undefined) {
                    const tankBodies = room === null || room === void 0 ? void 0 : room.players.map(player => player.id == this.player.id ? null : player.tankBody);
                    for (let go of tankBodies) {
                        if (go == null)
                            continue;
                        if (go.collidingProps == null)
                            continue;
                        let collide = (0, SAT_1.satCollide)(this.collidingProps.activeShape, go.collidingProps.activeShape);
                        if (collide) {
                            this.posX = tempPosX;
                            this.posY = tempPosY;
                            this.speed = 0;
                            break;
                        }
                    }
                }
            }
        }
        this.engine = "OFF";
        if (this.networkMovement == "UP") {
            if (this.maxSpeed > this.speed) {
                this.speed += this.pushSpeed;
                this.engine = "UP";
            }
            if (this.networkRotate == "LEFT") {
                this.rotation -= this.rotationSpeed;
            }
            if (this.networkRotate == "RIGHT") {
                this.rotation += this.rotationSpeed;
            }
        }
        else if (this.networkMovement == "DOWN") {
            if (this.minSpeed < this.speed) {
                this.speed -= this.pushSpeed;
                this.engine = "DOWN";
            }
            if (this.networkRotate == "LEFT") {
                this.rotation += this.rotationSpeed;
            }
            if (this.networkRotate == "RIGHT") {
                this.rotation -= this.rotationSpeed;
            }
        }
        else {
            if (this.networkRotate == "LEFT") {
                this.rotation -= this.rotationSpeed;
            }
            if (this.networkRotate == "RIGHT") {
                this.rotation += this.rotationSpeed;
            }
        }
        // if (CanvasManager.keyDown("p")) {
        //     this.posX = 0;
        //     this.posY = 0;
        // }
        if (this.collidingProps != null) {
            this.collidingProps.activeShape = (0, SAT_1.updateShape)(this.posX + this.width / 2, this.posY + this.height / 2, this.rotation, this.collidingProps.shape);
            if (this.player.roomCode) {
                const room = RoomManager_1.default.getRoomByCode(this.player.roomCode);
                if (room != undefined) {
                    const tankBodies = room === null || room === void 0 ? void 0 : room.players.map(player => player.id == this.player.id ? null : player.tankBody);
                    for (let go of tankBodies) {
                        if (go == null)
                            continue;
                        if (go.collidingProps == null)
                            return;
                        let collide = (0, SAT_1.satCollide)(this.collidingProps.activeShape, go.collidingProps.activeShape);
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
            }
            else if (this.speed < 0) {
                this.speed += this.pushSpeed;
            }
        }
        this.weapon.update(deltaTime);
    }
    networkController(data) {
        this.networkRotate = data.rotate;
        this.networkMovement = data.movement;
        this.weapon.networkController(data.weapon);
    }
    networkData() {
        return {
            posX: this.posX,
            posY: this.posY,
            rotation: this.rotation,
            hp: this.hp,
            maxHp: this.maxHp,
            weapon: this.weapon.network(),
        };
    }
}
exports.HeavyTankBody = HeavyTankBody;
class EngeenierTankBody extends TankBody {
}
exports.EngeenierTankBody = EngeenierTankBody;
