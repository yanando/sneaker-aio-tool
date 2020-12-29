import { Client } from "discord.js";
import { CommandHandler } from "../commandhandler/CommandHandler";

export default class CustomClient extends Client {
    public commandHandler: CommandHandler
    constructor() {
        super()
        this.commandHandler = new CommandHandler()
    }
}