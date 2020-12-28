import { Command } from "../classes/Command";
import { Message } from "discord.js";

export default class PingCommand extends Command {
    readonly name = 'ping'
    readonly description = 'Replies with pong!'
    readonly adminOnly = false

    public run(msg: Message) {
        msg.channel.send('Pong!')
    }
}