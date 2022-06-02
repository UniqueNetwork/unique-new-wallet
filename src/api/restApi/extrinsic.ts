import { SubmitResultResponse, SubmitTxBody } from '@app/types/Api';
import { IBaseApi } from '@app/api';

const BASE_URL = '/extrinsic';

export const extrinsicSubmit = (Api: IBaseApi, data: SubmitTxBody) =>
  Api.post<SubmitResultResponse, SubmitTxBody>(`${BASE_URL}/submit`, data);
