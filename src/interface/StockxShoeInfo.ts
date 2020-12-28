export interface StockxShoeInfo {
    name: string
    imageURL: string
    payouts: StockxSizeInfo[]
}

export interface StockxSizeInfo {
    size: string
    level1: number
    level2: number
    level3: number
    level4: number
    [key: string]: any
}