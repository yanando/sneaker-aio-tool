import axios from 'axios'
import cheerio from 'cheerio'
import { RestocksShoeInfo } from '../interfaces/shoeinfo/RestocksShoeInfo'
import { ScrapeHelper } from '../interfaces/ScrapeHelper'

export class RestocksHelper implements ScrapeHelper{
    public async getSlug(keywords: string[]): Promise<string | undefined>{
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'))
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1))

        const results = await axios.get(`https://restocks.net/shop/search?q=${encodeURI(positiveKeywords.join(' '))}&page=1&filters[][range][price][gte]=1`)

        const shoeItems: any[] = results.data.data
        
        const filteredShoeItems = shoeItems.filter(item => {
            return !negativeKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()))
        })

        if (filteredShoeItems.length === 0) {
            return
        }

        const selectedItem = filteredShoeItems[0]

        return selectedItem.slug
    }

    public async getShoeInfo(slug: string): Promise<RestocksShoeInfo> {
        const shoePage = await axios.get(slug)

        console.log(shoePage.data)

        const $ = cheerio.load(shoePage.data)

        const resell = $('.select__size__list').children('[data-type="all"]').toArray().map(e => {
            const el = $(e)

            const size = el.find('.text').text()

            let price: number | undefined

            if (el.find('.price').text() === 'Notify me') {
                price = undefined
            } else {
                price = parseInt(el.find('.price').text().match(/\d+ €/)![0].split(' ')[0])
            }

            let payout
            if (!price) {
                payout = undefined
            } else {
                payout = price! * 0.90 - 10
            }

            return {
                size: size,
                basePrice: price,
                payout: payout
            }
        })

        const consign = $('.select__size__list').children('[data-type="consign"]').toArray().map(e => {
            const el = $(e)

            const size = el.find('.text').text()

            let price: number | undefined

            if (el.find('.price').text() === 'Notify me') {
                price = undefined
            } else {
                price = parseInt(el.find('.price').children().first().text().split('€ ')[1])
            }

            let payout
            if (!price) {
                payout = undefined
            } else {
                payout = price! * 0.95 - 10
            }

            return {
                size: size,
                basePrice: price,
                payout: payout 
            }
        })

        const name = $('.product__title').children().first().text()

        const imageURL = $('.swiper-slide').first().children().first().attr('src')!

        const payouts = resell.map((sizeinfo, i) => {

            let resellPrice = sizeinfo.payout
            let consignPrice = consign[i].payout

            if (!sizeinfo.payout) {
                const basePrice = consign[i].basePrice

                if (!basePrice) {
                    resellPrice = undefined
                } else {
                    resellPrice = basePrice * 0.90 - 10
                }
            }

            if (!consignPrice) {
                const basePrice = sizeinfo.basePrice

                if (!basePrice) {
                    consignPrice = undefined
                } else {
                    consignPrice = basePrice * 0.95 - 10
                }
            }

            return {
                size: sizeinfo.size,
                resellPrice: resellPrice,
                consignPrice: consignPrice
            }
        })

        return {
            name: name,
            imageURL: imageURL,
            payouts: payouts
        }
    }
}