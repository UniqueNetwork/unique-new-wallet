import React from 'react';
import { FormikProps } from 'formik';

import { TokenAttributes, TokenField } from '@app/types';

export interface TokenFormProps {
  attributes: TokenAttributes;
  createSchema: (tokenFields: TokenField[]) => void;
  tokenForm: FormikProps<any>;
  setAttributes: (attributes: TokenAttributes) => void;
  setTokenImg: (tokenImage: Blob | null) => void;
  tokenImg: Blob | null;
  resetForm: () => void;
}

export const TokenFormContext: React.Context<TokenFormProps> = React.createContext(
  {} as unknown as TokenFormProps,
);

export default TokenFormContext;
