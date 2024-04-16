"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShootSpell = exports.Spell = void 0;
const Projectiles_1 = require("../Projectiles/Projectiles");
class Spell {
    constructor(gameManager, player) {
        this.gameManager = gameManager;
        this.player = player;
        this.cooldown = 0;
        this.spellType = null;
    }
    execute() { }
}
exports.Spell = Spell;
class ShootSpell extends Spell {
    constructor(gameManager, player) {
        super(gameManager, player);
        this.cooldown = 4;
        this.spellType = "shoot";
    }
    execute() {
        let tankBody = this.player.tankBody;
        if (!tankBody)
            return;
        const { rotation, width, height, posX, posY } = tankBody;
        const weaponRotation = tankBody.weapon.rotation;
        const spawnX = Math.cos(weaponRotation + rotation) * 90 + posX + width / 2;
        const spawnY = Math.sin(weaponRotation + rotation) * 90 + posY + height / 2;
        // const bullet = new Bullet();
        // bullet.posX = spawnX + this.tankBody.posX + this.tankBody.width / 2;
        // bullet.posY = spawnY + this.tankBody.posY + this.tankBody.height / 2;
        const projectile = new Projectiles_1.Projectile(100, { x: spawnX, y: spawnY }, rotation + weaponRotation, tankBody.id, this.gameManager);
        this.gameManager.gameObjects.projectiles.push(projectile);
    }
}
exports.ShootSpell = ShootSpell;
