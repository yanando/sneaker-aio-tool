import { Client } from "discord.js";
import { CommandHandler } from "../commandhandler/CommandHandler";

export default class CustomClient extends Client {
    public commandHandler: CommandHandler
    constructor(...args: any) {
        super(...args)
        this.commandHandler = new CommandHandler()
    }
}