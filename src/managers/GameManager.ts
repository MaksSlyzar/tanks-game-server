import { EngeenierTankBody, HeavyTankBody } from "../GameObjects/TankBody";
import Room from "../room/Room";

class GameManager {
    room: Room;

    constructor (room: Room) {
        this.room = room;
        this.generateTanks();
        this.update();
    }

    generateTanks () {
        this.room.players.forEach(player => {
            switch (player.gameRole) {
                case "engeenier":
                    player.tankBody = new EngeenierTankBody("engeenier");
                break;

                case "heavy":
                    player.tankBody = new HeavyTankBody();
                break;
            }
        });

        const playersData = this.room.players.map((player) => {
            return { 
                ...player.tankBody?.networkData(), id: player.id 
            }
        });

        this.room.io.to(this.room.roomCode).emit("createGameObjects", { players: playersData, gameObjects: [] });
    }

    update () {
        setTimeout(() => this.update(), 100);
    }
}

export default GameManager;