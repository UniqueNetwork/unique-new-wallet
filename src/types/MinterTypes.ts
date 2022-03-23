export enum MinterType {
  default = 'Not started', // initial state
  purchase = 'Purchase', // fix price
  bid = 'Bid',
  withdrawBid = 'Withdraw bid',
  sellFix = 'Sell for fixed price',
  sellAuction = 'Auction',
  transfer = 'Transfer',
  delist = 'Cancel sell',
  delistAuction = 'Cancel auction'
}
