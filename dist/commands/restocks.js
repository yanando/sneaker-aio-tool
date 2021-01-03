"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RestocksHelper_1 = require("../helpers/RestocksHelper");
const discord_js_1 = require("discord.js");
const Config_1 = require("../Config");
class RestocksCommand {
    constructor() {
        this.name = 'restocks';
        this.description = 'Gets Restocks payouts based on keywords';
        this.adminOnly = false;
        this.usage = `${Config_1.prefix}${this.name} <...keywords>`;
        this.restocksHelper = new RestocksHelper_1.RestocksHelper();
    }
    async run(message, args) {
        console.log(`${message.author.username} has requested ${args.join(' ')} | Restocks`);
        const slug = await this.restocksHelper.getSlug(args);
        if (!slug) {
            const embed = new discord_js_1.MessageEmbed()
                .setTitle('Error scraping Restocks payouts')
                .setDescription(`Keywords: ${args.join(' ')}\nError: keywords returned no response`)
                .setFooter(`Requested by ${message.author.tag} • Made by yanando#0001`)
                .setColor('#00e0ff')
                .setTimestamp();
            message.channel.send(embed);
            return;
        }
        const shoeInfo = await this.restocksHelper.getShoeInfo(slug);
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`Restocks | ${shoeInfo.name}`)
            .setURL(`https://restocks.nl${slug}`)
            .setThumbnail(encodeURI(shoeInfo.imageURL))
            .setDescription(`Keywords: ${args.join(' ')}`)
            .addField('Sizes', shoeInfo.payouts.map(e => e.size).join('\n'), true)
            .addField('C|R Payout', shoeInfo.payouts.map(e => `${e.consignPrice && e.consignPrice.toFixed(2) || 'N/A'} | ${e.resellPrice && e.resellPrice.toFixed(2) || 'N/A'}`), true)
            .setFooter(`Requested by ${message.author.tag} • Made by yanando#0001`)
            .setColor('#00e0ff')
            .setTimestamp();
        message.channel.send(embed);
    }
}
exports.default = RestocksCommand;
