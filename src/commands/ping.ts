import { Command } from "../classes/Command";
import { Message } from "discord.js";
import { prefix } from "../Config";

export default class PingCommand extends Command {
    readonly name = 'ping'
    readonly description = 'Replies with pong!'
    readonly adminOnly = false
    readonly usage = `${prefix}${this.name}`

    public run(msg: Message) {
        msg.channel.send('Pong!')
    }
}