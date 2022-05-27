import { Api } from '@app/api/restApi/base';

const BASE_URL = '/extrinsic';

export const extrinsicSubmit = (data: any) => Api.post(`${BASE_URL}/submit`, data);
