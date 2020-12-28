export interface RestocksShoeInfo {
    name: string
    imageURL: string
    payouts: RestocksSizeInfo[]
}

export interface RestocksSizeInfo {
    size: string
    resellPrice?: string
    consignPrice?: string
}