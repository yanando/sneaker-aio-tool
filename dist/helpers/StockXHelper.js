"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockxHelper = void 0;
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const Config_1 = require("../Config");
const level1Cut = 0.905; // 9,5%
const level2Cut = 0.91; // 9%
const level3Cut = 0.915; // 8.5%
const level4Cut = 0.92; // 8%
const paymentProcessingFee = 0.03; // 3%
class StockxHelper {
    async getSlug(keywords) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'));
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1));
        const options = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-algolia-api-key': Config_1.stockxAPIKey,
                'x-algolia-application-id': Config_1.stockxApplicationID,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
            },
            body: `{"query": "${positiveKeywords.join(' ')}","facets": "*","filters": ""}`
        };
        const response = await request_promise_native_1.default.post('https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.5.1)%3B%20Browser', options);
        const jsonResponse = JSON.parse(response);
        const items = jsonResponse.hits;
        const filteredItems = items.filter(item => {
            return !negativeKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()));
        });
        if (filteredItems.length === 0) {
            return;
        }
        return filteredItems[0].url;
    }
    async getShoeInfo(slug, currency) {
        const options = {
            headers: {
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
            },
            json: true
        };
        if (currency === 'USD') {
            options.proxy = 'http://KKB1E:FY4VA8UI@172.121.156.10:38171';
        }
        const response = await request_promise_native_1.default.get(`https://stockx.com/api/products/${slug}?includes=market&currency=${currency}`, options);
        const product = response["Product"];
        const imageURL = product.media.imageUrl;
        const name = product.title;
        const sizes = [];
        for (let key in product.children) {
            sizes.push(product.children[key]);
        }
        const sizeInfo = sizes.map(size => {
            const basePrice = size.market.lowestAsk;
            const processingFee = basePrice * paymentProcessingFee;
            return {
                size: size.shoeSize,
                lowestAsk: basePrice.toString(),
                level1: basePrice * level1Cut - processingFee,
                level2: basePrice * level2Cut - processingFee,
                level3: basePrice * level3Cut - processingFee,
                level4: basePrice * level4Cut - processingFee,
            };
        });
        return {
            imageURL: imageURL,
            name: name,
            payouts: sizeInfo
        };
    }
}
exports.StockxHelper = StockxHelper;
