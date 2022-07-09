export interface ShoeInfo {
    name: string
    imageURL: string
    payouts: payoutInfo[]
}

export interface payoutInfo {
    size: string
}