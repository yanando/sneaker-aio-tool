"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandHandler_1 = require("../commandhandler/CommandHandler");
class Bot {
    constructor(token, prefix) {
        this.token = token;
        this.prefix = prefix;
        this.client = new discord_js_1.Client();
        this.commandHandler = new CommandHandler_1.CommandHandler();
    }
    async start() {
        // login
        await this.client.login(this.token);
        // register listeners
        this.client.on('message', msg => this.onMessage(msg));
        this.client.on('error', error => {
            console.log(error);
            this.client.destroy();
        });
        // initialize commands
        await this.commandHandler.initialize();
    }
    onMessage(message) {
        var _a;
        if (!message.content.startsWith(this.prefix) || message.author.bot)
            return;
        const args = message.content.split(/ +/g);
        const commandName = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.slice(1);
        const command = this.commandHandler.commands.get(commandName);
        if (!command) {
            return message.channel.send('command doesnt exist');
        }
        try {
            command.run(message, args);
        }
        catch (error) {
            message.channel.send('Something went wrong while executing this commmand. An error log has been sent to yanando#0001');
            this.client.channels.cache.get('680813832813543554').send(error);
        }
    }
}
exports.Bot = Bot;
