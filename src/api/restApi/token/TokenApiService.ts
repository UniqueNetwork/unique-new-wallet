import { TransferTokenMutation } from '@app/api/restApi/token/TransferTokenMutation';
import { BurnTokenMutation } from '@app/api/restApi/token/BurnTokenMutation';

export class TokenApiService {
  static transferMutation = new TransferTokenMutation();
  static burnMutation = new BurnTokenMutation();
}
