import GameManager from "../../managers/GameManager";
import Player from "../../room/Player";
import { Projectile } from "../Projectiles/Projectiles";
import { HeavyTankBody } from "../TankBody";

export class Spell {
    gameManager: GameManager;
    player: Player;
    cooldown: number;
    spellType: "test"|"shoot"|null;

    constructor (gameManager: GameManager, player: Player) {
        this.gameManager = gameManager;
        this.player = player;
        this.cooldown = 0;
        this.spellType = null;
    }

    execute () {

    }
}

export class ShootSpell extends Spell {
    constructor (gameManager: GameManager, player: Player) {
        super(gameManager, player);
        this.cooldown = 4;
        this.spellType = "shoot";
    }

    execute () {
        let tankBody = this.player.tankBody as HeavyTankBody;
        
        if (!tankBody)
            return;

        const { rotation, width, height, posX, posY } = tankBody;
        const weaponRotation = tankBody.weapon.rotation;

        const spawnX = Math.cos(weaponRotation + rotation) * 90;
        const spawnY = Math.sin(weaponRotation + rotation) * 90;
        
        const projectile = new Projectile(4, { x: spawnX, y: spawnY }, rotation + weaponRotation);
        this.gameManager.gameObjects.push(projectile);
    }
}
