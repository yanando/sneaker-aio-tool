"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
const GoatHelper_1 = require("../helpers/GoatHelper");
const discord_js_1 = require("discord.js");
class GoatCommand {
    constructor() {
        this.name = 'goat';
        this.description = 'Gets GOAT payouts based on keywords';
        this.adminOnly = false;
        this.usage = `${Config_1.prefix}${this.name} <payout type (paypal | transferwise)> <...keywords>`;
        this.goatHelper = new GoatHelper_1.GoatHelper();
    }
    async run(message, args) {
        console.log(`${message.author.username} has requested ${args.join(' ')} | GOAT`);
        const slug = await this.goatHelper.getSlug(args);
        if (!slug) {
            const embed = new discord_js_1.MessageEmbed()
                .setTitle('Error scraping Goat payouts')
                .setDescription(`Keywords: ${args.join(' ')}\nError: keywords returned no response`)
                .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} • Made by yanando#0001`)
                .setColor('#00e0ff')
                .setTimestamp();
            message.channel.send(embed);
            return;
        }
        const shoeInfo = await this.goatHelper.getShoeInfo(slug);
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`GOAT | ${shoeInfo.name}`)
            .setURL(`https://www.goat.com/sneakers/${slug}`)
            .setThumbnail(shoeInfo.imageURL)
            .setDescription(`Keywords: ${args.join(' ')}`)
            .addField('Sizes', shoeInfo.payouts.map(e => e.size).join('\n'), true)
            .addField('Payout in $', shoeInfo.payouts.map(e => e.payout ? e.payout.toFixed(2) : 'N/A').join('\n'), true)
            .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} • Made by yanando#0001`)
            .setColor('#00e0ff')
            .setTimestamp();
        message.channel.send(embed);
    }
}
exports.default = GoatCommand;
