"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandHandler_1 = require("../commandhandler/CommandHandler");
class CustomClient extends discord_js_1.Client {
    constructor(...args) {
        super(...args);
        this.commandHandler = new CommandHandler_1.CommandHandler();
    }
}
exports.default = CustomClient;
