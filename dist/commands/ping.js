"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
class PingCommand {
    constructor() {
        this.name = 'ping';
        this.description = 'Replies with pong!';
        this.adminOnly = false;
        this.usage = `${Config_1.prefix}${this.name}`;
    }
    run(msg) {
        msg.channel.send('Pong!');
    }
}
exports.default = PingCommand;
