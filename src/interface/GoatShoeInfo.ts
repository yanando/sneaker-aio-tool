export interface GoatShoeInfo {
    name: string
    imageURL: string
    payouts: GoatSizeInfo[]
}

export interface GoatSizeInfo {
    size: string
    payout: number
}