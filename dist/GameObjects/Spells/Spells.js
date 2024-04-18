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
        this.lastTime = new Date();
        this.currentTime = new Date();
    }
    setCooldown() {
        this.lastTime = new Date();
    }
    isCooldown() {
        return ((new Date().getTime() - this.lastTime.getTime()) / 1000 >
            this.cooldown);
    }
    execute() { }
    network() {
        return {
            cooldown: this.cooldown,
            lastTime: this.lastTime,
        };
    }
}
exports.Spell = Spell;
class ShootSpell extends Spell {
    constructor(gameManager, player) {
        super(gameManager, player);
        this.cooldown = 0.5;
        this.spellType = "shoot";
    }
    execute() {
        if (this.isCooldown())
            this.setCooldown();
        else
            return;
        let tankBody = this.player.tankBody;
        if (!tankBody)
            return;
        const { rotation, width, height, posX, posY } = tankBody;
        const weaponRotation = tankBody.weapon.rotation;
        const spawnX = Math.cos(weaponRotation + rotation) * 90 + posX + width / 2;
        const spawnY = Math.sin(weaponRotation + rotation) * 90 + posY + height / 2;
        const projectile = new Projectiles_1.Projectile(200, { x: spawnX, y: spawnY }, rotation + weaponRotation, tankBody.id, this.gameManager);
        this.gameManager.gameObjects.projectiles.push(projectile);
    }
}
exports.ShootSpell = ShootSpell;
