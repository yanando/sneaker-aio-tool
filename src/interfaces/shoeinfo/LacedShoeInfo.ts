export interface LacedShoeInfo {
    name: string
    imageURL: string
    payouts: LacedSizeInfo[]
}

export interface LacedSizeInfo {
    size: string
    payout: number
}