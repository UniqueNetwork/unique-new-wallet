// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormikProps } from 'formik';

import type {
  ArtificialAttributeItemType,
  MainInformationInitialValues,
  NftCollectionDTO,
} from '@app/types';

export type AttributesCallBackType = (
  prevAttributes: ArtificialAttributeItemType[],
) => ArtificialAttributeItemType[];

export interface CollectionFormProps {
  attributes: ArtificialAttributeItemType[];
  coverImgFile: Blob | null;
  imgAddress?: string;
  mainInformationForm: FormikProps<MainInformationInitialValues>;
  ownerCanDestroy: boolean;
  ownerCanTransfer: boolean;
  setAttributes: (
    attributes: ArtificialAttributeItemType[] | AttributesCallBackType,
  ) => void;
  setCoverImgFile: (coverImg: Blob | null) => void;
  setOwnerCanDestroy: (ownerCanDestroy: boolean) => void;
  setOwnerCanTransfer: (ownerCanTransfer: boolean) => void;
  setTokenLimit: (tokenLimit: number | null) => void;
  setVariableSchema: (variableSchema: string) => void;
  tokenLimit: number | null;
  variableSchema: string;
  mapFormToCollectionDto: (address: string) => NftCollectionDTO;
}

export const CollectionFormContext: React.Context<CollectionFormProps> =
  React.createContext({} as unknown as CollectionFormProps);

export default CollectionFormContext;
