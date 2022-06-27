import { BurnTokenMutation } from './BurnTokenMutation';
import { TransferTokenMutation } from './TransferTokenMutation';
import { TokenCreateMutation } from './TokenCreateMutation';

export class TokenApiService {
  static tokenCreateMutation = new TokenCreateMutation();
  static transferMutation = new TransferTokenMutation();
  static burnMutation = new BurnTokenMutation();
}
