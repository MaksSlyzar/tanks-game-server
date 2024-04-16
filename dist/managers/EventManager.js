"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const events_1 = require("../server/events");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
class EventManager {
    constructor() {
        this.listeningIds = [];
        const app = (0, express_1.default)();
        const urlencodedParser = body_parser_1.default.urlencoded({
            extended: true,
        });
        // app.use(cors({ }))
        app.use(urlencodedParser);
        app.get("/", (req, res) => {
            res.send("23er4t5yhtr");
        });
        app.post("/create-user", urlencodedParser, (req, res) => {
            const body = req.body;
            console.log(body);
            res.send("qwerty");
        });
        const server = app.listen(3040, () => console.log("server started"));
        this.io = new socket_io_1.Server(server, {
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
    run() { }
    setIo() {
        this.io.on("connection", (socket) => {
            if (this.io == null)
                return;
            events_1.events["connection"].execute(socket, this.io, null);
            if (this.listeningIds.includes(socket.id) == false) {
                this.listeningIds.push(socket.id);
                for (let eventName in events_1.events) {
                    socket.on(eventName, (data) => {
                        const eventExecResult = events_1.events[eventName].execute(socket, this.io, data);
                        if (eventExecResult)
                            socket.emit("error", "server can't execute this event.");
                    });
                }
            }
        });
    }
}
exports.default = new EventManager();
