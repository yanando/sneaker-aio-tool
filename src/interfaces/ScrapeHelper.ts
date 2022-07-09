import { ShoeInfo } from "./shoeinfo/ShoeInfo";

export interface ScrapeHelper {
    getSlug(keywords: string[]): Promise<string | undefined>
    getShoeInfo(slug: string): Promise<ShoeInfo>
}

export interface StockXScrapeHelper extends Omit<ScrapeHelper, 'getShoeInfo'> {
    getShoeInfo(slug: string, currency: 'EUR' | 'USD'): Promise<ShoeInfo>
}