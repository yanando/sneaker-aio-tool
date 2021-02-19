"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const CustomClient_1 = __importDefault(require("./classes/CustomClient"));
class Bot {
    constructor(token, prefix) {
        this.token = token;
        this.prefix = prefix;
        this.client = new CustomClient_1.default();
    }
    async start() {
        var _a;
        // login
        await this.client.login(this.token);
        // register listeners
        this.client.on('message', msg => {
            if (msg.author.id === '502229568959021056' || msg.author.id === '720256021066416178')
                return;
            this.onMessage(msg);
        });
        this.client.on('error', error => {
            console.log(error);
            // this.client.destroy()
        });
        process.on('uncaughtException', console.log);
        process.on('unhandledRejection', console.log);
        // initialize commands
        await this.client.commandHandler.initialize();
        // set status 
        await ((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setActivity("$help", { type: 'WATCHING' }));
    }
    onMessage(message) {
        var _a;
        if (!message.content.startsWith(this.prefix) || message.author.bot)
            return;
        const args = message.content.split(/ +/g);
        const commandName = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.slice(1);
        const command = this.client.commandHandler.commands.get(commandName);
        if (!command) {
            return message.channel.send('command doesnt exist');
        }
        try {
            command.run(message, args);
        }
        catch (error) {
            message.channel.send('Something went wrong while executing this commmand. An error log has been sent to yanando#0001');
            this.client.channels.cache.get('680813832813543554').send(error);
        }
    }
}
exports.Bot = Bot;
