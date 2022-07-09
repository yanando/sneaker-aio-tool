import { Message } from "discord.js";
import { prefix } from "../Config";
import { IconifyHelper } from "../helpers/IconifyHelper";
import { Command } from "../interfaces/Command";


export default class IconifyCommand implements Command {
    readonly adminOnly = false
    readonly description = 'Gets Iconify payouts based on keywords'
    readonly name = "iconify"
    readonly usage = `${prefix}${this.name} <sellerlevel (bronze, silver, gold, platinum, iconic)> <...keywords>`

    private iconifyHelper: IconifyHelper

    constructor() {
        this.iconifyHelper = new IconifyHelper()
    }

    public async run(message: Message, args: string[]) {
        this.iconifyHelper.getSlug(args)
    }
}