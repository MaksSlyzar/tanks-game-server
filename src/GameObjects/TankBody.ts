export class TankBody {
    posX: number;
    posY: number;
    rotation: number;
    _type: "heavy"|"engeenier"|"test";

    constructor (_type: "heavy"|"engeenier"|"test") {
        this.posX = 0;
        this.posY = 0;
        this.rotation = 0;
        this._type = _type;
    }

    update () {
        
    }

    networkData () {
        return {}
    }
}

export class HeavyTankBody extends TankBody {
    constructor () {
        super("heavy");
    }

    networkData() {
        return {
            targetX: this.posX,
            targetY: this.posY,
            rotation: this.rotation,
            weapon: {},
            _type: this._type
        }
    }
}

export class EngeenierTankBody extends TankBody {

}