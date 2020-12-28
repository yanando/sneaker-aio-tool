"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
class CommandHandler {
    constructor() {
        this.commands = new Map();
    }
    async initialize() {
        const commandDir = await promises_1.default.readdir('./dist/commands');
        commandDir.forEach(commandName => {
            if (!commandName.endsWith('.js'))
                return;
            const DynamicCommand = require('../commands/' + commandName.split('.js')[0]).default;
            const commandInstance = new DynamicCommand();
            this.commands.set(commandInstance.name, commandInstance);
        });
    }
}
exports.CommandHandler = CommandHandler;
