import request from 'request-promise-native'
import { GoatSizeInfo, GoatShoeInfo } from '../interfaces/shoeinfo/GoatShoeInfo'
import { ScrapeHelper } from '../interfaces/ScrapeHelper'

const goatCut = 0.905 // 9.5%
const goatShipping = 10 // 10usd

const payoutFee = 0.971 // 2.9%

export class GoatHelper implements ScrapeHelper{
    r: request.RequestPromiseAPI
    constructor() {
        this.r = request.defaults({
            proxy: 'http://YANAN80DKQLCN1:VYY7D9DUIZ9W4O@45.144.72.7:39876',
            resolveWithFullResponse: true
        })
    }
    public async getSlug(keywords: string[]) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'))
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1))

        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `{"params":"query=&query=${encodeURI(positiveKeywords.join(' '))}&distinct=true&facetFilters=(product_category%3Ashoes)&page=0&hitsPerPage=20&clickAnalytics=true"}`,
            json: true
        }

        const url = 'https://2fwotdvm2o-dsn.algolia.net/1/indexes/product_variants_v2_trending_purchase/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a'

        const resp = await this.r.post(url, options)

        const hits: any[] = resp.body.hits.filter((item: any) => {
            return !negativeKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()))
        })

        if (hits.length === 0) {
            return
        }

        return hits[0].slug as string
    }

    public async getShoeInfo(slug: string): Promise<GoatShoeInfo> {
        const url = `https://www.goat.com/web-api/v1/product_variants?productTemplateId=${slug}`

        const resp = await this.r.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
            },
            json: true
        })

        const { imageURL, name } = await this.getNameAndImage(slug)

        const sizes: any[] = resp.body.filter((size: any) => size.shoeCondition === 'new_no_defects' && size.boxCondition === 'good_condition')

        const sizeInfo: GoatSizeInfo[] = sizes.map((size: any) => {
            const basePrice = size.lowestPriceCents.amount / 100

            const payout = (basePrice * goatCut - goatShipping) * payoutFee

            return {
                size: size.sizeOption.presentation,
                payout: payout
            }
        })

        return {
            name: name,
            imageURL: imageURL,
            payouts: sizeInfo
        }
    }

    private async getNameAndImage(slug: string) {
        const productPage = await this.r.get(`https://www.goat.com/sneakers/${slug}`, {headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
        }})

        const imageURL: string = productPage.body.split('","image":"')[1].split('"')[0]
        const name: string = productPage.body.split('"@type":"Product","name":"')[1].split('"')[0]

        return {
            imageURL,
            name
        }
    }
}