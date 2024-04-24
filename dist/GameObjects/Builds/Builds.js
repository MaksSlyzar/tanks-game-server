"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBuild = exports.Build = void 0;
const GameObject_1 = __importDefault(require("../GameObject"));
class Build extends GameObject_1.default {
    constructor() {
        super();
        this.width = 0;
        this.height = 0;
        this.hp = 1;
        this.maxHp = 1;
        this.type = "none";
    }
    decraseHp(damage) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = this.maxHp;
            this.posX = 0;
            this.posY = 0;
        }
    }
    network() {
        return {
            id: this.id,
            posX: this.posX,
            posY: this.posY,
            hp: this.hp,
            maxHp: this.maxHp,
            _type: this.type,
        };
    }
}
exports.Build = Build;
class BaseBuild extends Build {
    constructor() {
        super();
        this.width = 96;
        this.height = 96;
        this.posX = 500;
        this.posY = 500;
        this.maxHp = 100;
        this.hp = this.maxHp;
        this.type = "base";
    }
    update() { }
}
exports.BaseBuild = BaseBuild;
