"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconifyHelper = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
var ConsignFees;
(function (ConsignFees) {
    ConsignFees[ConsignFees["Bronze"] = 6] = "Bronze";
    ConsignFees[ConsignFees["Silver"] = 5.5] = "Silver";
    ConsignFees[ConsignFees["Gold"] = 5] = "Gold";
    ConsignFees[ConsignFees["Platinum"] = 4.5] = "Platinum";
    ConsignFees[ConsignFees["Iconic"] = 4] = "Iconic";
})(ConsignFees || (ConsignFees = {}));
var ResellFees;
(function (ResellFees) {
    ResellFees[ResellFees["Bronze"] = 10.5] = "Bronze";
    ResellFees[ResellFees["Silver"] = 10] = "Silver";
    ResellFees[ResellFees["Gold"] = 10] = "Gold";
    ResellFees[ResellFees["Platinum"] = 9.5] = "Platinum";
    ResellFees[ResellFees["Iconic"] = 9] = "Iconic";
})(ResellFees || (ResellFees = {}));
class IconifyHelper {
    constructor() {
        this.r = request_promise_native_1.default.defaults({
            resolveWithFullResponse: true,
            headers: {
                "User-Agent": "Yanando Iconify scraper V0.0.1 - Contact yanando#0001 on discord in case of complaints"
            }
        });
    }
    async getSlug(keywords) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'));
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1));
        const options = {
            form: {
                search: positiveKeywords.join(' '),
                record_page: 9,
                current_page: 0
            }
        };
        const resp = await this.r.post("https://iconify.eu/ajax/catalog/search.php", options);
        const $ = cheerio_1.default.load(resp.body);
        const filtereditems = $(".search-description").filter((_, e) => {
            const text = $(e).text();
            return !negativeKeywords.some(e => text.toLowerCase().includes(e.toLowerCase()));
        });
        if (filtereditems.length < 1) {
            return;
        }
        const slug = filtereditems.first().parent().attr()["href"];
        return "https://iconify.eu/" + slug;
    }
    async getShoeInfo(slug) {
        return {
            name: "bruh",
            imageURL: "bruh",
            payouts: [],
        };
    }
}
exports.IconifyHelper = IconifyHelper;
