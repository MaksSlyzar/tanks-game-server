import { Vector2d } from "../../modules/SAT";
import GameObject from "../GameObject";

export class Projectile extends GameObject {
    speed: number;
    posX: number;
    posY: number;
    rotation: number;
    
    constructor (speed: number, position: Vector2d, rotation: number) {
        super();
        this.speed = speed;
        this.posX = position.x;
        this.posY = position.y;
        this.rotation = rotation;
    }

    update () {

    }

    render () {

    }
}