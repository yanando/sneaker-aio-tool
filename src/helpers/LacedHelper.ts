import { ScrapeHelper } from "../interfaces/ScrapeHelper";
import request from "request-promise-native";
import { LacedShoeInfo, LacedSizeInfo } from "../interfaces/shoeinfo/LacedShoeInfo";
import { proxyURL } from "../Config";

const lacedCut = 0.12 // 12%
const paymentProcessingFee = 0.03 // 3%
const shippingFee = 20 // £20

export class LacedHelper implements ScrapeHelper {
    public async getSlug(keywords: string[]) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'))
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1))

        const url = `https://www.laced.co.uk/search?utf8=%E2%9C%93&search%5Bsort_by%5D=&search%5Bterm%5D=${positiveKeywords.join('+')}`
        
        const response = await request.get(url, {proxy: proxyURL})

        const infoObject = JSON.parse(((response as string).split('data-react-props="')[4].split('"')[0] as any).replaceAll('&quot;', '"'))

        const filteredShoeItems: any[] = infoObject.products.filter((item: any) => {
            return !negativeKeywords.some(keyword => item.title.toLowerCase().includes(keyword.toLowerCase()))
        })

        if (filteredShoeItems.length === 0) {
            return
        }

        return filteredShoeItems[0].href
    }

    public async getShoeInfo(slug: string): Promise<LacedShoeInfo> {
        const resp = await request.get(`https://www.laced.co.uk${slug}`, {proxy: proxyURL})

        const infoObject = JSON.parse(resp.split('data-react-props="')[5].split('"')[0].replaceAll('&quot;', '"'))

        const imageURL = resp.split('<meta property="og:image" content="')[1].split('"')[0]

        const name = resp.split('<meta property="og:title" content="')[1].split(' |')[0]

        const payouts: LacedSizeInfo[] = (infoObject.sizesAndPrices as any[]).map((sizeObj: any) => {

            if (sizeObj.size === '640') {
                sizeObj.size = '6 (EU 40)'
            } else if (sizeObj.size === '639') {
                sizeObj.size = '6 (EU 39)'
            }

            const size: string = sizeObj.size

            const basePrice = parseInt(sizeObj.price)

            const fees = basePrice * (lacedCut + paymentProcessingFee)
            const payout = basePrice - fees - shippingFee

            return {
                size: size,
                payout: payout
            }
        }).sort((a, b) => {
            let aSize: any = a.size
            let bSize: any = b.size
            
            if (a.size === '6 (EU 40)') aSize = '6.4'
            if (a.size === '6 (EU 39)') aSize = '6.2'

            if (b.size === '6 (EU 40)') bSize = '6.4'
            if (b.size === '6 (EU 39)') bSize = '6.2'

            return aSize - bSize
        })

        return {
            name: name,
            imageURL: imageURL,
            payouts: payouts
        }
    }
}