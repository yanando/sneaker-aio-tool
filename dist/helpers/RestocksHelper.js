"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestocksHelper = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
class RestocksHelper {
    async getSlug(keywords) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'));
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1));
        const results = await axios_1.default.get(`https://restocks.net/shop/search?q=${encodeURI(positiveKeywords.join(' '))}&page=1&filters[][range][price][gte]=1`);
        const shoeItems = results.data.data;
        const filteredShoeItems = shoeItems.filter(item => {
            return !negativeKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()));
        });
        if (filteredShoeItems.length === 0) {
            return;
        }
        const selectedItem = filteredShoeItems[0];
        return selectedItem.slug;
    }
    async getShoeInfo(slug) {
        const shoePage = await axios_1.default.get(slug);
        const $ = cheerio_1.default.load(shoePage.data);
        const resell = $('.select__size__list').children('[data-type="all"]').toArray().map(e => {
            const el = $(e);
            const size = el.find('.text').text();
            let price;
            if (el.find('.price').text() === 'Notify me') {
                price = undefined;
            }
            else {
                price = parseInt(el.find('.price').text().split('\n')[0].replace('€ ', '').replace('.', ''));
                console.log(el.find('.price').text().split('\n')[0].replace('€ ', '').replace('.', '') + "\n\n\n");
            }
            let payout;
            if (!price) {
                payout = undefined;
            }
            else {
                payout = price * 0.90 - 10;
            }
            return {
                size: size,
                basePrice: price,
                payout: payout
            };
        });
        const consign = $('.select__size__list').children('[data-type="consign"]').toArray().map(e => {
            const el = $(e);
            const size = el.find('.text').text();
            let price;
            if (el.find('.price').text() === 'Notify me') {
                price = undefined;
            }
            else {
                price = parseInt(el.find('.price').children().first().text().split('€ ')[1]);
            }
            let payout;
            if (!price) {
                payout = undefined;
            }
            else {
                payout = price * 0.95 - 10;
            }
            return {
                size: size,
                basePrice: price,
                payout: payout
            };
        });
        const name = $('.product__title').children().first().text();
        const imageURL = $('.swiper-slide').first().children().first().attr('src');
        const payouts = resell.map((sizeinfo, i) => {
            let resellPrice = sizeinfo.payout;
            let consignPrice = consign[i].payout;
            if (!sizeinfo.payout) {
                const basePrice = consign[i].basePrice;
                if (!basePrice) {
                    resellPrice = undefined;
                }
                else {
                    resellPrice = basePrice * 0.90 - 10;
                }
            }
            if (!consignPrice) {
                const basePrice = sizeinfo.basePrice;
                if (!basePrice) {
                    consignPrice = undefined;
                }
                else {
                    consignPrice = basePrice * 0.95 - 10;
                }
            }
            return {
                size: sizeinfo.size,
                resellPrice: resellPrice,
                consignPrice: consignPrice
            };
        });
        return {
            name: name,
            imageURL: imageURL,
            payouts: payouts
        };
    }
}
exports.RestocksHelper = RestocksHelper;
