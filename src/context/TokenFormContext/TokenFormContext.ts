import React from 'react';
import { FormikProps } from 'formik';

import { NftTokenDTO, TokenAttributes, TokenField } from '@app/types';

export interface TokenFormProps {
  tokenImg: Blob | null;
  tokenForm: FormikProps<any>;
  attributes: TokenAttributes;
  resetForm: () => void;
  setTokenImg: (tokenImage: Blob | null) => void;
  setAttributes: (attributes: TokenAttributes) => void;
  initializeTokenForm: (tokenFields: TokenField[]) => void;
  mapFormToTokenDto: (collectionId: number, address: string) => NftTokenDTO | null;
}

export const TokenFormContext: React.Context<TokenFormProps> = React.createContext(
  {} as unknown as TokenFormProps,
);

export default TokenFormContext;
