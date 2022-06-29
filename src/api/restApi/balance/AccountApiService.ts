import { AccountBalanceTransferMutation } from './mutations/AccountBalanceTransferMutation';
import { AccountBalanceQuery } from './queries/AccountBalanceQuery';

export class AccountApiService {
  static balanceQuery = new AccountBalanceQuery();
  static balanceTransfer = new AccountBalanceTransferMutation();
}
