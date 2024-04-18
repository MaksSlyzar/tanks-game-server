import GameObject from "../GameObject";

export class Build extends GameObject {
    hp: number;
    maxHp: number;
    width: number = 0;
    height: number = 0;
    type: "none" | "base";

    constructor() {
        super();

        this.hp = 1;
        this.maxHp = 1;
        this.type = "none";
    }

    decraseHp(damage: number) {
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

export class BaseBuild extends Build {
    width: number = 96;
    height: number = 96;

    constructor() {
        super();
        this.posX = 0;
        this.posY = 0;
        this.maxHp = 100;
        this.hp = this.maxHp;
        this.type = "base";
    }

    update() {}
}
