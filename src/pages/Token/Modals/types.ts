import { Token } from '../../../api/graphQL/tokens/types';

export type TTransfer = {
  sender: string
  recipient: string
}

export type TFixPriceProps = {
  accountAddress: string
  price: number // float number
}

export type TPurchaseProps = {
  accountAddress: string
}

export type TDelistProps = {
  accountAddress: string
}

export type TAuctionProps = {
  accountAddress: string
  minimumStep: number
  startingPrice: number
  duration: number // days number
}

export type TPlaceABid = {
  amount: string
}

export interface ModalProps {
  token?: Token
  [key: string]: any
}

export type TAuctionBidProps = {
  value: string
  accountAddress: string
}
