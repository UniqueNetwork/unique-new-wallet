// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import type { ArtificialAttributeItemType } from '@app/types';

export type AttributesCallBackType = (prevAttributes: ArtificialAttributeItemType[]) => ArtificialAttributeItemType[]

export interface CollectionFormProps {
  attributes: ArtificialAttributeItemType[];
  avatarImg: File | null;
  coverImg: File | null;
  description: string;
  imgAddress?: string;
  mintFest: boolean;
  name: string;
  ownerCanDestroy: boolean;
  ownerCanTransfer: boolean;
  setAttributes: (attributes: ArtificialAttributeItemType[] | AttributesCallBackType) => void;
  setAvatarImg: (avatarImg: File | null) => void;
  setCoverImg: (coverImg: File | null) => void;
  setDescription: (description: string) => void;
  setImgAddress: (imgAddress?: string) => void;
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
