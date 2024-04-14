"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeavyWeapon = void 0;
const GameObject_1 = __importDefault(require("./GameObject"));
class HeavyWeapon extends GameObject_1.default {
    constructor(tankBody) {
        super();
        this.dx = 0;
        this.dy = 0;
        this.rotationSpeed = 0.125;
        this.rotation = 0.09;
        this.tankBody = tankBody;
    }
    update(deltaTime) {
        // if (CanvasManager.keyDown("e")) {
        //     this.rotation -= 0.02;
        // }
        // if (CanvasManager.keyDown("r")) {
        //     this.rotation += 0.02;
        // }
        // const dx = CanvasManager.mouse.x - this.tankBody.posX -45;
        // const dy = CanvasManager.mouse.y - this.tankBody.posY -40;
        const addRotation = -Math.atan2(this.dx, this.dy) + (90 * Math.PI / 180);
        if (Math.abs(addRotation - this.rotation - this.tankBody.rotation) <= 0.04) {
            this.rotation = addRotation - this.tankBody.rotation;
            return;
        }
        if (addRotation > this.rotation + this.tankBody.rotation) {
            if (360 - toDeg(addRotation) + toDeg(this.rotation + this.tankBody.rotation) < toDeg(addRotation) - toDeg(this.rotation + this.tankBody.rotation)) {
                this.rotation -= this.rotationSpeed * deltaTime;
            }
            else {
                this.rotation += this.rotationSpeed * deltaTime;
            }
        }
        else {
            if (360 - toDeg(this.rotation + this.tankBody.rotation) + toDeg(addRotation) < toDeg(this.rotation + this.tankBody.rotation) - toDeg(addRotation)) {
                this.rotation += this.rotationSpeed * deltaTime;
            }
            else {
                this.rotation -= this.rotationSpeed * deltaTime;
            }
        }
        if (this.rotation + this.tankBody.rotation < -1.57) {
            this.rotation = 6.28 - 1.57 - this.tankBody.rotation;
        }
        else if (this.rotation + this.tankBody.rotation > 6.28 - 1.57) {
            this.rotation = -1.57 - this.tankBody.rotation;
        }
    }
    network() {
        return {
            rotation: this.rotation
        };
    }
    networkController(data) {
        this.dx = data.dx;
        this.dy = data.dy;
    }
}
exports.HeavyWeapon = HeavyWeapon;
function toDeg(num) {
    return num * 180 / Math.PI + 90;
}
function toRad(num) {
    return (num - 90) * Math.PI / 180;
}
