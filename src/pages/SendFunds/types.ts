import { Account } from '@app/account';

export type FundsForm = {
  from: Account;
  to: Account;
  amount: number;
};
