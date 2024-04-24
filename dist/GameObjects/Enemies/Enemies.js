"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEnemy = exports.Enemy = void 0;
const GameObject_1 = __importDefault(require("../GameObject"));
class Enemy extends GameObject_1.default {
    constructor() {
        super();
    }
    network() {
        return {
            posX: this.posX,
            posY: this.posY,
            rotation: this.rotation,
            id: this.id,
        };
    }
}
exports.Enemy = Enemy;
class TestEnemy extends Enemy {
    constructor(damageTarget) {
        super();
        this.damageTargetType = "build";
        this.damageTarget = damageTarget;
    }
    update() { }
}
exports.TestEnemy = TestEnemy;
