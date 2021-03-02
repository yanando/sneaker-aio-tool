export interface StadiumGoodsShoeInfo {
    name: string
    imageURL: string
    payouts: StadiumGoodsSizeInfo[]
}

export interface StadiumGoodsSizeInfo {
    size: string
    payout: number
}