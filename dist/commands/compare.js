"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
const GoatHelper_1 = require("../helpers/GoatHelper");
const RestocksHelper_1 = require("../helpers/RestocksHelper");
const StockXHelper_1 = require("../helpers/StockXHelper");
class CompareCommand {
    constructor() {
        this.name = 'compare';
        this.description = 'compares prices from restocks, goat and stockx';
        this.adminOnly = false;
        this.usage = `${Config_1.prefix}${this.name} <...keywords>`;
        this.stockxHelper = new StockXHelper_1.StockxHelper();
        this.goatHelper = new GoatHelper_1.GoatHelper();
        this.restocksHelper = new RestocksHelper_1.RestocksHelper();
    }
    async run(message, args) {
        if (args.length === 0) {
            message.channel.send('no arguments were provided');
            return;
        }
        const stockxSlug = await this.stockxHelper.getSlug(args);
        if (!stockxSlug) {
            message.channel.send('keywords returned no results on stockx');
            return;
        }
        const stockxShoeInfo = await this.stockxHelper.getShoeInfo(stockxSlug);
        console.log(stockxShoeInfo);
    }
}
exports.default = CompareCommand;
