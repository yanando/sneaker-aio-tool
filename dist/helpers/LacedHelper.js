"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const lacedCut = 0.12; // 12%
const paymentProcessingFee = 0.03; // 3%
const shippingFee = 20; // £20
class LacedHelper {
    async getSlug(keywords) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'));
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1));
        const url = `https://www.laced.co.uk/search?utf8=%E2%9C%93&search%5Bsort_by%5D=&search%5Bterm%5D=${positiveKeywords.join('+')}`;
        const response = await axios_1.default.get(url);
        const infoObject = JSON.parse(response.data.split('data-react-props="')[4].split('"')[0].replaceAll('&quot;', '"'));
        const filteredShoeItems = infoObject.products.filter((item) => {
            return !negativeKeywords.some(keyword => item.title.toLowerCase().includes(keyword.toLowerCase()));
        });
        if (filteredShoeItems.length === 0) {
            return;
        }
        return filteredShoeItems[0].href;
    }
    async getShoeInfo(slug) {
        const resp = await axios_1.default.get(`https://www.laced.co.uk${slug}`);
        const infoObject = JSON.parse(resp.data.split('data-react-props="')[5].split('"')[0].replaceAll('&quot;', '"'));
        const imageURL = resp.data.split('<meta property="og:image" content="')[1].split('"')[0];
        const name = resp.data.split('<meta property="og:title" content="')[1].split(' |')[0];
        const payouts = infoObject.sizesAndPrices.map((sizeObj) => {
            if (sizeObj.size === '640') {
                sizeObj.size = '6 (EU 40)';
            }
            else if (sizeObj.size === '639') {
                sizeObj.size = '6 (EU 39)';
            }
            const size = sizeObj.size;
            const basePrice = parseInt(sizeObj.price);
            const fees = basePrice * (lacedCut + paymentProcessingFee);
            const payout = basePrice - fees - shippingFee;
            return {
                size: size,
                payout: payout
            };
        }).sort((a, b) => {
            let aSize = a.size;
            let bSize = b.size;
            if (a.size === '6 (EU 40)')
                aSize = '6.4';
            if (a.size === '6 (EU 39)')
                aSize = '6.2';
            if (b.size === '6 (EU 40)')
                bSize = '6.4';
            if (b.size === '6 (EU 39)')
                bSize = '6.2';
            return aSize - bSize;
        });
        return {
            name: name,
            imageURL: imageURL,
            payouts: payouts
        };
    }
}
exports.LacedHelper = LacedHelper;
