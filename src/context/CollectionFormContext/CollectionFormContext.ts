// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormikProps } from 'formik';
import type { ArtificialAttributeItemType, MainInformationInitialValues } from '@app/types';

export type AttributesCallBackType = (prevAttributes: ArtificialAttributeItemType[]) => ArtificialAttributeItemType[];

export interface CollectionFormProps {
  attributes: ArtificialAttributeItemType[];
  avatarImg: File | null;
  coverImgFile: File | null;
  coverImgAddress?: string;
  description: string;
  imgAddress?: string;
  mainInformationForm: FormikProps<MainInformationInitialValues>;
  mintFest: boolean;
  name: string;
  ownerCanDestroy: boolean;
  ownerCanTransfer: boolean;
  setAttributes: (attributes: ArtificialAttributeItemType[] | AttributesCallBackType) => void;
  setAvatarImg: (avatarImg: File | null) => void;
  setCoverImgFile: (coverImg: File | null) => void;
  setCoverImgAddress: (address: string | undefined) => void;
  setDescription: (description: string) => void;
  setMintFest: (mintFest: boolean) => void;
  setName: (name: string) => void;
  setOwnerCanDestroy: (ownerCanDestroy: boolean) => void;
  setOwnerCanTransfer: (ownerCanTransfer: boolean) => void;
  setTokenImg: (tokenImg: File | null) => void;
  setTokenLimit: (tokenLimit: string) => void;
  setTokenPrefix: (tokenPrefix: string) => void;
  setVariableSchema: (variableSchema: string) => void;
  tokenImg: File | null;
  tokenLimit: string;
  tokenPrefix: string;
  variableSchema: string;
}

export const CollectionFormContext: React.Context<CollectionFormProps> = React.createContext({} as unknown as CollectionFormProps);

export default CollectionFormContext;
