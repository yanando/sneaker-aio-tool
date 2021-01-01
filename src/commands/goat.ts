import { Command } from "../interfaces/Command";
import { prefix } from "../Config";
import { GoatHelper } from "../helpers/GoatHelper";
import { Message, MessageEmbed } from "discord.js";

export default class GoatCommand implements Command {
    readonly name = 'goat'
    readonly description = 'Gets GOAT payouts based on keywords'
    readonly adminOnly = false
    readonly usage = `${prefix}${this.name} <payout type (paypal | transferwise)> <...keywords>`

    private goatHelper: GoatHelper

    constructor() {
        this.goatHelper = new GoatHelper()
    }

    public async run(message: Message, args: string[]) {
        console.log(`${message.author.username} has requested ${args.join(' ')} | GOAT`)
        const slug = await this.goatHelper.getSlug(args)

        if (!slug) {
            const embed = new MessageEmbed()
                .setTitle('Error scraping Goat payouts')
                .setDescription(`Keywords: ${args.join(' ')}\nError: keywords returned no response`)
                .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} • Made by yanando#0001`)
                .setColor('#00e0ff')
                .setTimestamp()

            message.channel.send(embed)
            return
        }

        const shoeInfo = await this.goatHelper.getShoeInfo(slug)

        const embed = new MessageEmbed()
            .setTitle(`GOAT | ${shoeInfo.name}`)
            .setURL(`https://www.goat.com/sneakers/${slug}`)
            .setThumbnail(shoeInfo.imageURL)
            .setDescription(`Keywords: ${args.join(' ')}`)
            .addField('Sizes', shoeInfo.payouts.map(e => e.size).join('\n'), true)
            .addField('Payout in $', shoeInfo.payouts.map(e =>  e.payout ? e.payout.toFixed(2) : 'N/A').join('\n'), true)
            .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} • Made by yanando#0001`)
            .setColor('#00e0ff')
            .setTimestamp()

        message.channel.send(embed)
    }
}