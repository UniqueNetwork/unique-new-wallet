// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormikProps } from 'formik';

import type {
  ArtificialAttributeItemType,
  MainInformationInitialValues,
} from '@app/types';

export type AttributesCallBackType = (
  prevAttributes: ArtificialAttributeItemType[],
) => ArtificialAttributeItemType[];

export interface CollectionFormProps {
  attributes: ArtificialAttributeItemType[];
  coverImgFile: Blob | null;
  imgAddress?: string;
  mainInformationForm: FormikProps<MainInformationInitialValues>;
  mintFest: boolean;
  ownerCanDestroy: boolean;
  ownerCanTransfer: boolean;
  setAttributes: (
    attributes: ArtificialAttributeItemType[] | AttributesCallBackType,
  ) => void;
  setCoverImgFile: (coverImg: Blob | null) => void;
  setMintFest: (mintFest: boolean) => void;
  setOwnerCanDestroy: (ownerCanDestroy: boolean) => void;
  setOwnerCanTransfer: (ownerCanTransfer: boolean) => void;
  setTokenImg: (tokenImg: Blob | null) => void;
  setTokenLimit: (tokenLimit: number) => void;
  setVariableSchema: (variableSchema: string) => void;
  tokenImg: Blob | null;
  tokenLimit: number;
  variableSchema: string;
}

export const CollectionFormContext: React.Context<CollectionFormProps> =
  React.createContext({} as unknown as CollectionFormProps);

export default CollectionFormContext;
