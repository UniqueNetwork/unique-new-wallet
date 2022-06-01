import { Api } from '@app/api/restApi/base';
import { SubmitResultResponse, SubmitTxBody } from '@app/types/Api';

const BASE_URL = '/extrinsic';

export const extrinsicSubmit = (data: SubmitTxBody) =>
  Api.post<SubmitResultResponse>(`${BASE_URL}/submit`, data);
