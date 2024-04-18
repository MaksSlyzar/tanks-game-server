import GameManager from "../../managers/GameManager";
import {
    Vector2d,
    quadColliderMesh,
    satCollide,
    updateShape,
} from "../../modules/SAT";
import GameObject from "../GameObject";

export class Projectile extends GameObject {
    speed: number;
    posX: number;
    posY: number;
    rotation: number;
    tankBodyId: number;
    width: number;
    height: number;
    gameManager: GameManager;
    startX: number;
    startY: number;

    constructor(
        speed: number,
        position: Vector2d,
        rotation: number,
        tankBodyId: number,
        gameManager: GameManager
    ) {
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
            shape: quadColliderMesh(this.width, this.height),
        };
    }

    update(deltaTime: number) {
        if (this.collidingProps == null) return;

        this.collidingProps.activeShape = updateShape(
            this.posX + this.width / 2,
            this.posY + this.height / 2,
            this.rotation,
            this.collidingProps.shape
        );

        const gameObjects = [...this.gameManager.gameObjects.tankBodies];

        for (let go of gameObjects) {
            if (go.id == this.id) continue;
            if (go.collidingProps == null) continue;
            if (go.id == this.tankBodyId) continue;

            let collide = satCollide(
                this.collidingProps.activeShape,
                go.collidingProps.activeShape
            );
            if (collide) {
                go.decraseHp(10);

                for (
                    let i = 0;
                    i < this.gameManager.gameObjects.projectiles.length;
                    i++
                ) {
                    const proj = this.gameManager.gameObjects.projectiles[i];

                    if (proj.id == this.id)
                        this.gameManager.gameObjects.projectiles.splice(i, 1);
                }
                break;
            }
        }

        this.posX += Math.cos(this.rotation) * this.speed * deltaTime;
        this.posY += Math.sin(this.rotation) * this.speed * deltaTime;

        const distance = Math.sqrt(
            Math.pow(Math.abs(this.posY - this.startY), 2) +
                Math.pow(Math.abs(this.startX - this.posX), 2)
        );

        if (distance > 1000) {
            const projectile =
                this.gameManager.gameObjects.projectiles.findIndex(
                    (_projectile) => _projectile.id == this.id
                );

            if (projectile != null)
                this.gameManager.gameObjects.projectiles.splice(projectile, 1);
        }
    }

    render() {}

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
