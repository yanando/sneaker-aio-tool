import { Command } from "../interfaces/Command";
import { prefix } from "../Config";
import { Message, MessageEmbed } from "discord.js";
import { LacedHelper } from "../helpers/LacedHelper";

export default class LacedCommand implements Command {
    readonly name = 'laced'
    readonly description = 'Gets Laced payouts based on keywords'
    readonly adminOnly = false
    readonly usage = `${prefix}${this.name} <...keywords>`

    private lacedHelper: LacedHelper

    constructor() {
        this.lacedHelper = new LacedHelper()
    }

    public async run(message: Message, args: string[]) {
        const slug = await this.lacedHelper.getSlug(args)

        if (!slug) {
            const embed = new MessageEmbed()
                .setTitle('Error scraping Laced payouts')
                .setDescription(`Keywords: ${args.join(' ')}\nError: keywords returned no response`)
                .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} • Made by yanando#0001`)
                .setColor('#00e0ff')
                .setTimestamp()

            message.channel.send(embed)
            return
        }

        const shoeInfo = await this.lacedHelper.getShoeInfo(slug)

        const embed = new MessageEmbed()
            .setTitle(`Laced | ${shoeInfo.name}`)
            .setURL(`https://laced.co.uk${slug}`)
            .setThumbnail(shoeInfo.imageURL)
            .setDescription(`Keywords: ${args.join(' ')}`)
            .addField('Sizes', shoeInfo.payouts.map(e => `UK ${e.size}`).join('\n'), true)
            .addField('Payout in £', shoeInfo.payouts.map(e => e.payout.toFixed(2)), true)
            .setFooter(`Requested by ${message.author.tag} • Made by yanando#0001`)
            .setColor('#00e0ff')
            .setTimestamp()

        message.channel.send(embed)
    }
}