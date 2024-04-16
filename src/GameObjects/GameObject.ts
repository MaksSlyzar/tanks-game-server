import { Vector2d } from "../modules/SAT";
import { generateToken } from "../server/events";

export default class GameObject {
    posX: number = -1;
    posY: number = -1;
    rotation: number = 0;
    collidingProps: {
        shape: Array<Vector2d>;
        activeShape: Array<Vector2d>;
    } | null = null;
    id: number;

    constructor() {
        this.id = Number(generateToken());
    }

    update(deltaTime: number) {}

    network() {}
}
