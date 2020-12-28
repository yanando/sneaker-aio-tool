"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const Bot_1 = require("./bot/Bot");
(async () => {
    const bot = new Bot_1.Bot(Config_1.token, Config_1.prefix);
    await bot.start();
    console.log('started');
})();
