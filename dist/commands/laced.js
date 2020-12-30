"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
const discord_js_1 = require("discord.js");
const LacedHelper_1 = require("../helpers/LacedHelper");
class LacedCommand {
    constructor() {
        this.name = 'laced';
        this.description = 'scrapes laced payouts';
        this.adminOnly = false;
        this.usage = `${Config_1.prefix}${this.name} <...keywords>`;
        this.lacedHelper = new LacedHelper_1.LacedHelper();
    }
    async run(message, args) {
        const slug = await this.lacedHelper.getSlug(args);
        if (!slug) {
            const embed = new discord_js_1.MessageEmbed()
                .setTitle('Error scraping Laced payouts')
                .setDescription(`Keywords: ${args.join(' ')}\nError: keywords returned no response`)
                .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} • Made by yanando#0001`)
                .setColor('#00e0ff')
                .setTimestamp();
            message.channel.send(embed);
            return;
        }
        const shoeInfo = await this.lacedHelper.getShoeInfo(slug);
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`Laced | ${shoeInfo.name}`)
            .setURL(`https://laced.co.uk${slug}`)
            .setThumbnail(shoeInfo.imageURL)
            .setDescription(`Keywords: ${args.join(' ')}`)
            .addField('Sizes', shoeInfo.payouts.map(e => `UK ${e.size}`).join('\n'), true)
            .addField('Payout in £', shoeInfo.payouts.map(e => e.payout.toFixed(2)), true)
            .setFooter(`Requested by ${message.author.tag} • Made by yanando#0001`)
            .setColor('#00e0ff')
            .setTimestamp();
        message.channel.send(embed);
    }
}
exports.default = LacedCommand;
