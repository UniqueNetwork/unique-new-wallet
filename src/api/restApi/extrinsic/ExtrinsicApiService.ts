import { CalculateFeeMutation } from './CalculateFeeMutation';
import { ExtrinsicStatusQuery } from './StatusExtrinsicQuery';
import { SubmitExtrinsicMutation } from './SubmitExtrinsicMutation';

export class ExtrinsicApiService {
  static submitExtrinsic = new SubmitExtrinsicMutation();
  static statusQuery = new ExtrinsicStatusQuery();
  static calculateFee = new CalculateFeeMutation();
}
