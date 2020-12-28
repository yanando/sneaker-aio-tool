import axios, { AxiosRequestConfig } from 'axios'
import { StockxShoeInfo, StockxSizeInfo } from '../interface/StockxShoeInfo'

const level1Cut = 0.905 // 9,5%
const level2Cut = 0.91  // 9%
const level3Cut = 0.915 // 8.5%
const level4Cut = 0.92  // 8%

const paymentProcessingFee = 0.03

export class StockxHelper {
    public async getSlug(keywords: string[]) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'))
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1))

        const options: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-algolia-api-key': '6bfb5abee4dcd8cea8f0ca1ca085c2b3',
                'x-algolia-application-id': 'XW7SBCT9V6'
                // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
            }
        }

        const body = {
            query: positiveKeywords.join(' '),
            facets: '*',
            filters: ''
        }

        const response = await axios.post('https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.5.1)%3B%20Browser', body, options)

        const items: any[] = response.data.hits

        const filteredItems = items.filter(item => {
            return !negativeKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()))
        })

        if (filteredItems.length === 0) {
            return
        }

        return filteredItems[0].url as string
    }

    public async getShoeInfo(slug: string): Promise<StockxShoeInfo> {
        const response = await axios.get(`https://stockx.com/api/products/${slug}?includes=market&currency=EUR`, {headers: {
            "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'}
        })

        const product = response.data["Product"]

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
                size: `US ${size.shoeSize}`,
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