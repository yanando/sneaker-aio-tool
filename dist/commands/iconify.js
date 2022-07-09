"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
const IconifyHelper_1 = require("../helpers/IconifyHelper");
class IconifyCommand {
    constructor() {
        this.adminOnly = false;
        this.description = 'Gets Iconify payouts based on keywords';
        this.name = "iconify";
        this.usage = `${Config_1.prefix}${this.name} <sellerlevel (bronze, silver, gold, platinum, iconic)> <...keywords>`;
        this.iconifyHelper = new IconifyHelper_1.IconifyHelper();
    }
    async run(message, args) {
        this.iconifyHelper.getSlug(args);
    }
}
exports.default = IconifyCommand;
