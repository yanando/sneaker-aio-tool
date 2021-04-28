import { Command } from "../interfaces/Command";
import { RestocksHelper } from "../helpers/RestocksHelper";
import { Message, MessageEmbed } from "discord.js";
import { prefix } from "../Config";

export default class RestocksCommand implements Command {
    readonly name = 'restocks'
    readonly description = 'Gets Restocks payouts based on keywords'
    readonly adminOnly = false
    readonly usage = `${prefix}${this.name} <...keywords>`

    private restocksHelper: RestocksHelper

    constructor() {
        this.restocksHelper = new RestocksHelper()
    }

    public async run(message: Message, args: string[]) {
        console.log(`${message.author.username} has requested ${args.join(' ')} | Restocks`)
        const slug = await this.restocksHelper.getSlug(args)

        if (!slug) {
            const embed = new MessageEmbed()
                .setTitle('Error scraping Restocks payouts')
                .setDescription(`Keywords: ${args.join(' ')}\nError: keywords returned no response`)
                .setFooter(`Requested by ${message.author.tag} • Made by yanando#0001`)
                .setColor('#00e0ff')
                .setTimestamp()

            message.channel.send(embed)
            return
        }

        const shoeInfo = await this.restocksHelper.getShoeInfo(slug)

        const embed = new MessageEmbed()
            .setTitle(`Restocks | ${shoeInfo.name}`)
            .setURL(slug)
            .setThumbnail(encodeURI(shoeInfo.imageURL))
            .setDescription(`Keywords: ${args.join(' ')}`)
            .addField('Sizes', shoeInfo.payouts.map(e => e.size).join('\n'), true)
            .addField('C|R Payout', shoeInfo.payouts.map(e => `${e.consignPrice && e.consignPrice.toFixed(2) || 'N/A'} | ${e.resellPrice && e.resellPrice.toFixed(2) || 'N/A'}`), true)
            .setFooter(`Requested by ${message.author.tag} • Made by yanando#0001`)
            .setColor('#00e0ff')
            .setTimestamp()

        message.channel.send(embed)
    }
}