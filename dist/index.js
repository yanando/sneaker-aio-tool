"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const bot_1 = require("./bot");
(async () => {
    const bot = new bot_1.Bot(Config_1.token, Config_1.prefix);
    await bot.start();
    console.log('started');
})();
