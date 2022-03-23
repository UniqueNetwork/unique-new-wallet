export interface AccountVariables {
  accountId: string
}

export interface AccountData {
  account_by_pk: {
    account_id: string
    available_balance: string
    balances: string
    block_height: number
    free_balance: string
    locked_balance: string
    timestamp: number
    nonce: string
  }
}
