"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../classes/Command");
const Config_1 = require("../Config");
const axios_1 = __importDefault(require("axios"));
class ConvertCommand extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.name = 'convert';
        this.description = 'Convert currency';
        this.adminOnly = false;
        this.usage = `${Config_1.prefix}${this.name} <currency 1> <currency 2> <amount>\nI.E: ${Config_1.prefix}${this.name} GBP USD 500`;
        this.apiKey = '82826ef4e560576c5fe9';
    }
    async run(message, args) {
        var _a, _b;
        if (args.length !== 3) {
            message.channel.send(`not enough or too many arguments\nUsage: ${this.usage}`);
        }
        const currency1 = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toUpperCase();
        const currency2 = (_b = args.shift()) === null || _b === void 0 ? void 0 : _b.toUpperCase();
        const amount = parseFloat(args.shift());
        const rate = await this.getRate(currency1, currency2);
        if (isNaN(rate)) {
            return message.channel.send('invalid currency');
        }
        message.channel.send(`${amount} ${currency1} = ${(amount * rate).toFixed(2)} ${currency2}`);
    }
    async getRate(currency1, currenty2) {
        const url = `https://free.currconv.com/api/v7/convert?q=${currency1}_${currenty2}&compact=ultra&apiKey=${this.apiKey}`;
        const response = await axios_1.default.get(url, { validateStatus: () => false });
        if (response.status !== 200) {
            return NaN;
        }
        return response.data[`${currency1}_${currenty2}`];
    }
}
exports.default = ConvertCommand;
