"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../classes/Command");
class PingCommand extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.name = 'ping';
        this.description = 'Replies with pong!';
        this.adminOnly = false;
    }
    run(msg) {
        msg.channel.send('Pong!');
    }
}
exports.default = PingCommand;
