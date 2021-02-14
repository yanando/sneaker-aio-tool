import { Command } from "../interfaces/Command";
import { Message, MessageEmbed } from "discord.js";
import { StockxHelper } from '../helpers/StockXHelper'
import { prefix } from "../Config";

export default class StockXUSCommand implements Command {
    readonly name = 'stockxus'
    readonly description = 'Gets StockX US payouts based on keywords'
    readonly adminOnly = false
    readonly usage = `${prefix}${this.name} <sellerlevel (1, 2, 3 ,4)> <...keywords>`

    private stockxHelper: StockxHelper

    constructor() {
        this.stockxHelper = new StockxHelper()
    }

    public async run(message: Message, args: string[]) {
        console.log(`${message.author.username} has requested ${args.join(' ')} | StockX`)
        let sellerLevel = args.shift()!

        if (!['1', '2', '3', '4'].includes(sellerLevel)) {
            return message.channel.send(`Chosen sellerlevel doesn't exist\nUsage: \`\`${this.usage}\`\``)
        }

        sellerLevel = 'level' + sellerLevel

        const slug = await this.stockxHelper.getSlug(args)

        if (!slug) {
            const embed = new MessageEmbed()
            .setTitle('Error scraping StockX payouts')
            .setDescription(`Keywords: ${args.join(' ')}\nError: keywords returned no response`)
            .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} • Made by yanando#0001`)
            .setColor('#00e0ff')
            .setTimestamp()

            message.channel.send(embed)
            return
        }

        const shoeInfo = await this.stockxHelper.getShoeInfo(slug, 'USD')

        const embed = new MessageEmbed()
            .setTitle(`StockX | ${shoeInfo.name}`)
            .setURL(`https://stockx.com/${slug}`)
            .setThumbnail(shoeInfo.imageURL)
            .setDescription(`Keywords: ${args.join(' ')}`)
            .addField('Size', shoeInfo.payouts.map(payout => `US ${payout.size}`).join('\n'), true)
            .addField('Lowest Ask', shoeInfo.payouts.map(payout => payout.lowestAsk).join('\n'), true)
            .addField(`Level ${sellerLevel.split('level')[1]} payout`, shoeInfo.payouts.map(payout => `${payout[sellerLevel].toFixed(2) === '-5.00' ? 'N/A' : payout[sellerLevel].toFixed(2)}`).join('\n'), true)
            .setColor('#00e0ff')
            .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} • Made by yanando#0001`)
            .setTimestamp()

        message.channel.send(embed)
    }
}