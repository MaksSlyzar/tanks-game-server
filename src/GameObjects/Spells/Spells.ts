import GameManager from "../../managers/GameManager";
import Player from "../../room/Player";
import { Projectile } from "../Projectiles/Projectiles";
import { HeavyTankBody } from "../TankBody";

export class Spell {
    gameManager: GameManager;
    player: Player;
    cooldown: number;
    spellType: "test" | "shoot" | null;

    constructor(gameManager: GameManager, player: Player) {
        this.gameManager = gameManager;
        this.player = player;
        this.cooldown = 0;
        this.spellType = null;
    }

    execute() {}
}

export class ShootSpell extends Spell {
    constructor(gameManager: GameManager, player: Player) {
        super(gameManager, player);
        this.cooldown = 4;
        this.spellType = "shoot";
    }

    execute() {
        let tankBody = this.player.tankBody as HeavyTankBody;

        if (!tankBody) return;

        const { rotation, width, height, posX, posY } = tankBody;
        const weaponRotation = tankBody.weapon.rotation;

        const spawnX =
            Math.cos(weaponRotation + rotation) * 90 + posX + width / 2;
        const spawnY =
            Math.sin(weaponRotation + rotation) * 90 + posY + height / 2;

        // const bullet = new Bullet();
        // bullet.posX = spawnX + this.tankBody.posX + this.tankBody.width / 2;
        // bullet.posY = spawnY + this.tankBody.posY + this.tankBody.height / 2;

        const projectile = new Projectile(
            100,
            { x: spawnX, y: spawnY },
            rotation + weaponRotation,
            tankBody.id,
            this.gameManager
        );
        this.gameManager.gameObjects.projectiles.push(projectile);
    }
}
