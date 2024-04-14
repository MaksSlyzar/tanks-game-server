import { DisconnectReason, Server, Socket } from "socket.io";
import { events } from "../server/events";
import express, { Express, Request, Response } from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import { json } from "body-parser";
import cors from "cors";
import RoomManager from "./RoomManager";

class EventManager {
  io: Server;
  listeningIds: string[] = [];

  constructor() {
    const app = express();
    const urlencodedParser = bodyParser.urlencoded({
      extended: true,
    });
    // app.use(cors({ }))
    app.use(urlencodedParser);

    app.get("/", (req, res) => {
      res.send("23er4t5yhtr");
    });

    app.post(
      "/create-user",
      urlencodedParser,
      (req: Request, res: Response) => {
        const body = req.body;
        console.log(body);
        res.send("qwerty");
      }
    );
    const server = app.listen(3040, () => console.log("server started"));

    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // connect(
    //   "mongodb+srv://maksymsliuzar:C4Vn4oKMtsJbyEqo@cluster0.k9htvlh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    // ).then(() => {
    //   console.log("Db connected.");
    // });

    this.setIo();
  }

  run() {}

  setIo() {

    this.io.on("connection", (socket: Socket) => {
      if (this.io == null) return;

      events["connection"].execute(socket, this.io, null);

      if (this.listeningIds.includes(socket.id) == false) {
        this.listeningIds.push(socket.id);

        for (let eventName in events) {
          socket.on(eventName, (data: any) => {
            const eventExecResult = events[eventName].execute(socket, this.io, data)
          
            if (eventExecResult)
              socket.emit("error", "server can't execute this event.");
          });
        }
      }
    });
  }
}

export default new EventManager();
