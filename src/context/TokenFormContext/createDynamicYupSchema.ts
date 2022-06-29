import * as Yup from 'yup';

import { TokenField } from '@app/types';

export const createDynamicYupSchema = (tokenFields: TokenField[]) => {
  const schema: { [key: string]: any } = {};

  tokenFields.forEach((field: TokenField) => {
    if (field.type === 'text') {
      schema[field.name] = Yup.string();
    } else {
      schema[field.name] = Yup.array().of(Yup.string());
    }

    if (field.required) {
      schema[field.name] = schema[field.name].required('Required');
    }
  });

  return Yup.object({
    ...schema,
  });
};
