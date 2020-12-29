import { Command } from "../classes/Command";
import { prefix } from "../Config";
import { Message } from "discord.js";
import CustomClient from "../classes/CustomClient";

export default class HelpCommand extends Command {
    readonly name = 'help'
    readonly description = 'Lists all commands with their description or replies with a certain command\'s description and usage'
    readonly adminOnly = false
    readonly usage = `${prefix}${this.name} [name of the commmand]`

    public run(message: Message, args: string[]) {
        if (args.length === 0) {
            this.getAll(message)
        } else {
            this.getCommand(message, args[0])
        }
    }

    private getAll(message: Message) {
        const descriptionArray: {name: string; description:string}[] = [];

        (message.client as CustomClient).commandHandler.commands.forEach(value => {
            descriptionArray.push({
                name: value.name,
                description: value.description
            })
        })

        message.channel.send(`\`\`\`${descriptionArray.map(e => `${e.name}: ${e.description}`).join('\n')}\`\`\``)
    }

    private getCommand(message: Message, name: string) {
        const command = (message.client as CustomClient).commandHandler.commands.get(name)

        if (!command) {
            return message.channel.send('command not found')
        }

        message.channel.send(`name: ${command.name}
description: ${command.description}
usage: ${command.usage}`)
    }
}