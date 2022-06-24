import { ExtrinsicStatusQuery } from '@app/api/restApi/extrinsic/StatusExtrinsicQuery';

import { SubmitExtrinsicMutation } from './SubmitExtrinsicMutation';

export class ExtrinsicApiService {
  static submitExtrinsic = new SubmitExtrinsicMutation();
  static statusQuery = new ExtrinsicStatusQuery();
}
