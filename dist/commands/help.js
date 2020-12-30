"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
class HelpCommand {
    constructor() {
        this.name = 'help';
        this.description = 'Lists all commands with their description or replies with a certain command\'s description and usage';
        this.adminOnly = false;
        this.usage = `${Config_1.prefix}${this.name} [name of the commmand]`;
    }
    run(message, args) {
        if (args.length === 0) {
            this.getAll(message);
        }
        else {
            this.getCommand(message, args[0]);
        }
    }
    getAll(message) {
        const descriptionArray = [];
        message.client.commandHandler.commands.forEach(value => {
            descriptionArray.push({
                name: value.name,
                description: value.description
            });
        });
        message.channel.send(`\`\`\`${descriptionArray.map(e => `${e.name}: ${e.description}`).join('\n')}\`\`\``);
    }
    getCommand(message, name) {
        const command = message.client.commandHandler.commands.get(name);
        if (!command) {
            return message.channel.send('command not found');
        }
        message.channel.send(`name: ${command.name}
description: ${command.description}
usage: ${command.usage}`);
    }
}
exports.default = HelpCommand;
