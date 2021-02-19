import request from 'request-promise-native'
import { StockxShoeInfo, StockxSizeInfo } from '../interfaces/shoeinfo/StockxShoeInfo'
import { StockXScrapeHelper } from '../interfaces/ScrapeHelper'
import { stockxAPIKey, stockxApplicationID } from '../Config'

const level1Cut = 0.905 // 9,5%
const level2Cut = 0.91  // 9%
const level3Cut = 0.915 // 8.5%
const level4Cut = 0.92  // 8%

const paymentProcessingFee = 0.03 // 3%

export class StockxHelper implements StockXScrapeHelper {
    public async getSlug(keywords: string[]) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'))
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1))

        const options = {
            headers: {
                'content-type': 'application/x-www-forn-urlencoded',
                'x-algolia-api-key': stockxAPIKey,
                'x-algolia-application-id': stockxApplicationID,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
            },
            body: `{"query": "${positiveKeywords.join(' ')}","facets": "*","filters": ""}`
        }

        const response = await request.post('https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.5.1)%3B%20Browser', options)

        const jsonResponse = JSON.parse(response)

        const items: any[] = jsonResponse.hits

        const filteredItems = items.filter(item => {
            return !negativeKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()))
        })

        if (filteredItems.length === 0) {
            return
        }

        return filteredItems[0].url as string
    }

    public async getShoeInfo(slug: string, currency: 'EUR' | 'USD'): Promise<StockxShoeInfo> {

        const options: any = {
            headers: {
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
            },
            json: true
        }

        if (currency === 'USD') {
            options.proxy = 'http://KKB1E:FY4VA8UI@172.121.156.10:38171'
        }

        const response = await request.get(`https://stockx.com/api/products/${slug}?includes=market&currency=${currency}`, options)

        const product = response["Product"]

        const imageURL = product.media.imageUrl

        const name = product.title

        const sizes = []

        for (let key in product.children) {
            sizes.push(product.children[key])
        }

        const sizeInfo: StockxSizeInfo[] = sizes.map(size => {
            const basePrice: number = size.market.lowestAsk
            const processingFee = basePrice * paymentProcessingFee

            return {
                size: size.shoeSize,
                lowestAsk: basePrice.toString(),
                level1: basePrice * level1Cut - processingFee - 5,
                level2: basePrice * level2Cut - processingFee - 5,
                level3: basePrice * level3Cut - processingFee - 5,
                level4: basePrice * level4Cut - processingFee - 5,
            }
        })

        return {
            imageURL: imageURL,
            name: name,
            payouts: sizeInfo
        }
    }
}