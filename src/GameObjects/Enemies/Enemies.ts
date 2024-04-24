import GameManager from "../../managers/GameManager";
import GameObject from "../GameObject";

export class Enemy extends GameObject {
    _type: "test" | "none";
    hp: number;
    maxHp: number;

    constructor() {
        super();
        this._type = "none";
        this.hp = 1;
        this.maxHp = 1;
    }

    network() {
        return {
            posX: this.posX,
            posY: this.posY,
            rotation: this.rotation,
            id: this.id,
            _type: this._type,
            hp: this.hp,
            maxHp: this.maxHp,
        };
    }
}

export class TestEnemy extends Enemy {
    damageTarget: GameObject;
    damageTargetType: "build" | "tankBody";
    speed = 10;

    constructor(damageTarget: GameObject) {
        super();

        this._type = "test";
        this.damageTargetType = "build";
        this.damageTarget = damageTarget;

        this.posX = 0;
        this.posY = 0;

        this.hp = 100;
        this.maxHp = 100;
    }

    update(deltaTime: number) {
        this.rotation = Math.atan2(
            this.damageTarget.posY - this.posY,
            this.damageTarget.posX - this.posX
        );

        this.posX += Math.cos(this.rotation) * this.speed * deltaTime;
        this.posY += Math.sin(this.rotation) * this.speed * deltaTime;
    }
}
