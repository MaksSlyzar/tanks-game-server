"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projectile = void 0;
const SAT_1 = require("../../modules/SAT");
const GameObject_1 = __importDefault(require("../GameObject"));
class Projectile extends GameObject_1.default {
    constructor(speed, position, rotation, tankBodyId, gameManager) {
        super();
        this.speed = speed;
        this.posX = position.x;
        this.posY = position.y;
        this.rotation = rotation;
        this.tankBodyId = tankBodyId;
        this.gameManager = gameManager;
        this.startX = position.x;
        this.startY = position.y;
        this.width = 10;
        this.height = 10;
        this.collidingProps = {
            activeShape: [],
            shape: (0, SAT_1.quadColliderMesh)(this.width, this.height),
        };
    }
    update(deltaTime) {
        if (this.collidingProps == null)
            return;
        this.collidingProps.activeShape = (0, SAT_1.updateShape)(this.posX + this.width / 2, this.posY + this.height / 2, this.rotation, this.collidingProps.shape);
        const gameObjects = [...this.gameManager.gameObjects.tankBodies];
        for (let go of gameObjects) {
            if (go.id == this.id)
                continue;
            if (go.collidingProps == null)
                continue;
            if (go.id == this.tankBodyId)
                continue;
            let collide = (0, SAT_1.satCollide)(this.collidingProps.activeShape, go.collidingProps.activeShape);
            if (collide) {
                go.decraseHp(10);
                for (let i = 0; i < this.gameManager.gameObjects.projectiles.length; i++) {
                    const proj = this.gameManager.gameObjects.projectiles[i];
                    if (proj.id == this.id)
                        this.gameManager.gameObjects.projectiles.splice(i, 1);
                }
                break;
            }
        }
        this.posX += Math.cos(this.rotation) * this.speed * deltaTime;
        this.posY += Math.sin(this.rotation) * this.speed * deltaTime;
        const distance = Math.sqrt(Math.pow(Math.abs(this.posY - this.startY), 2) +
            Math.pow(Math.abs(this.startX - this.posX), 2));
        if (distance > 1000) {
            const projectile = this.gameManager.gameObjects.projectiles.findIndex((_projectile) => _projectile.id == this.id);
            if (projectile != null)
                this.gameManager.gameObjects.projectiles.splice(projectile, 1);
        }
    }
    render() { }
    network() {
        return {
            id: this.id,
            posX: this.posX,
            posY: this.posY,
            rotation: this.rotation,
            tankBodyId: this.tankBodyId,
        };
    }
}
exports.Projectile = Projectile;
