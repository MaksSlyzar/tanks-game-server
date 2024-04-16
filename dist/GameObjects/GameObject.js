"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../server/events");
class GameObject {
    constructor() {
        this.posX = -1;
        this.posY = -1;
        this.rotation = 0;
        this.collidingProps = null;
        this.id = Number((0, events_1.generateToken)());
    }
    update(deltaTime) { }
    network() { }
}
exports.default = GameObject;
