export interface GoatShoeInfo {
    name: string
    imageURL: string
    payouts: GoatSizeInfo[]
}

interface GoatSizeInfo {
    size: string
    payout: number
}