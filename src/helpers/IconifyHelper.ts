import cheerio from "cheerio";
import requestPromise from "request-promise-native";
import { ScrapeHelper } from "../interfaces/ScrapeHelper";
import { ShoeInfo } from "../interfaces/shoeinfo/ShoeInfo";

enum ConsignFees {
    Bronze = 6,
    Silver = 5.5,
    Gold = 5,
    Platinum = 4.5,
    Iconic = 4
}

enum ResellFees {
    Bronze = 10.5,
    Silver = 10,
    Gold = 10,
    Platinum = 9.5,
    Iconic = 9
}

export class IconifyHelper implements ScrapeHelper {
    r: requestPromise.RequestPromiseAPI
    constructor() {
        this.r = requestPromise.defaults({
            resolveWithFullResponse: true,
            headers: {
                "User-Agent": "Yanando Iconify scraper V0.0.1 - Contact yanando#0001 on discord in case of complaints"
            }
        })
    }

    public async getSlug(keywords: string[]) {
        const positiveKeywords = keywords.filter(keyword => !keyword.startsWith('-'))
        const negativeKeywords = keywords.filter(keyword => keyword.startsWith('-')).map(keyword => keyword.slice(1))
        
        const options = {
            form: {
                search: positiveKeywords.join(' '),
                record_page: 9,
                current_page: 0
            }
        }

        const resp = await this.r.post("https://iconify.eu/ajax/catalog/search.php", options)

        const $ = cheerio.load(<string>resp.body)

        const filtereditems = $(".search-description").filter((_, e) => {
            const text = $(e).text()

            return !negativeKeywords.some(e => text.toLowerCase().includes(e.toLowerCase()))
        })

        if (filtereditems.length < 1) {
            return
        }

        const slug = filtereditems.first().parent().attr()["href"]

        return "https://iconify.eu/"+slug
    }

    public async getShoeInfo(slug: string): Promise<ShoeInfo> {
        return {
            name: "bruh",
            imageURL: "bruh",
            payouts: [],
        }
    }    
}