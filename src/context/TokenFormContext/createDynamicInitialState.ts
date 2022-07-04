import { TokenField } from '@app/types';

export interface CreateNftInitialValues {
  [key: string]: string | string[];
}

export const createDynamicInitialState = (tokenFields: TokenField[]) => {
  const createNftInitialValues: CreateNftInitialValues = {};

  tokenFields.forEach((field: TokenField) => {
    if (field.type === 'text') {
      createNftInitialValues[field.name] = '';
    } else {
      createNftInitialValues[field.name] = [];
    }
  });

  return createNftInitialValues;
};
