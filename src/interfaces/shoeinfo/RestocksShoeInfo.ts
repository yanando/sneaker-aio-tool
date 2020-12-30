export interface RestocksShoeInfo {
    name: string
    imageURL: string
    payouts: RestocksSizeInfo[]
}

interface RestocksSizeInfo {
    size: string
    resellPrice?: number
    consignPrice?: number
}