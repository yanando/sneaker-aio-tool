import { GoatShoeInfo } from "./shoeinfo/GoatShoeInfo";
import { RestocksShoeInfo } from "./shoeinfo/RestocksShoeInfo";
import { StockxShoeInfo } from "./shoeinfo/StockxShoeInfo";
import { LacedShoeInfo } from "./shoeinfo/LacedShoeInfo";

export interface ScrapeHelper {
    getSlug(keywords: string[]): Promise<string | undefined>
    getShoeInfo(slug: string): Promise<RestocksShoeInfo | GoatShoeInfo | StockxShoeInfo | LacedShoeInfo>
}