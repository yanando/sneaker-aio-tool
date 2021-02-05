"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockxHelper = void 0;
const axios_1 = __importDefault(require("axios"));
const level1Cut = 0.905; // 9,5%
const level2Cut = 0.91; // 9%
const level3Cut = 0.915; // 8.5%
const level4Cut = 0.92; // 8%
const paymentProcessingFee = 0.03;
class StockxHelper {
    async getSlug(keywords) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'));
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1));
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-algolia-api-key': '6bfb5abee4dcd8cea8f0ca1ca085c2b3',
                'x-algolia-application-id': 'XW7SBCT9V6'
                // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
            }
        };
        const body = {
            query: positiveKeywords.join(' '),
            facets: '*',
            filters: ''
        };
        const response = await axios_1.default.post('https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.5.1)%3B%20Browser', body, options);
        const items = response.data.hits;
        const filteredItems = items.filter(item => {
            return !negativeKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()));
        });
        if (filteredItems.length === 0) {
            return;
        }
        return filteredItems[0].url;
    }
    async getShoeInfo(slug) {
        const response = await axios_1.default.get(`https://stockx.com/api/products/${slug}?includes=market&currency=EUR`, { headers: {
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
            }
        });
        const product = response.data["Product"];
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
                level1: basePrice * level1Cut - processingFee - 5,
                level2: basePrice * level2Cut - processingFee - 5,
                level3: basePrice * level3Cut - processingFee - 5,
                level4: basePrice * level4Cut - processingFee - 5,
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
