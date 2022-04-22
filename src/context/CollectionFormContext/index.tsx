// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  ArtificialAttributeItemType,
  AttributeItemType,
  MainInformationInitialValues,
  ProtobufAttributeType
} from '@app/types';
import { convertArtificialAttributesToProtobuf, fillProtobufJson, str2vec } from '@app/utils';

import CollectionFormContext from './CollectionFormContext';


interface Props {
  children: React.ReactNode;
}

export const defaultAttributesWithTokenIpfs: ArtificialAttributeItemType[] = [
  {
    fieldType: 'string',
    id: 0,
    name: 'ipfsJson',
    rule: 'required',
    values: []
  }
];

export function CollectionForm ({ children }: Props): React.ReactElement<Props> | null {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState<ArtificialAttributeItemType[]>(defaultAttributesWithTokenIpfs);
  const [avatarImg, setAvatarImg] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [coverImgFile, setCoverImgFile] = useState<File | null>(null);
  const [coverImgAddress, setCoverImgAddress] = useState<string>();
  const [name, setName] = useState<string>('');
  const [ownerCanTransfer, setOwnerCanTransfer] = useState<boolean>(false);
  const [ownerCanDestroy, setOwnerCanDestroy] = useState<boolean>(true);
  const [tokenPrefix, setTokenPrefix] = useState<string>('');
  const [tokenLimit, setTokenLimit] = useState<string>('');
  const [variableSchema, setVariableSchema] = useState<string>('');
  const [tokenImg, setTokenImg] = useState<File | null>(null);
  const [mintFest, setMintFest] = useState<boolean>(false);

  const mainInformationDefaultValues: MainInformationInitialValues = {
    name,
    description,
    tokenPrefix,
    coverImgAddress
  };

  const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
  const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);

  const nftAttributesDefaultValues = {
    constOnChainSchema: JSON.stringify(protobufJson),
    limits: {
      ownerCanDestroy,
      ownerCanTransfer,
      tokenLimit
    },
  };

  const collectionFull = {
    ...nftAttributesDefaultValues,
    description: str2vec(description),
    mode: { nft: null },
    name: str2vec(name),
    schemaVersion: 'Unique',
    tokenPrefix: str2vec(tokenPrefix),
    variableOnChainSchema: JSON.stringify({
      collectionCover: coverImgAddress
    })
  };

  const mainInformationForm = useFormik({
    initialValues: mainInformationDefaultValues,
    validate: (values) => {
      const errors: Partial<MainInformationInitialValues> = {};
      if (values.name.length === 0) {
        errors.name = 'Field required';
      }
      if (values.tokenPrefix.length === 0) {
        errors.tokenPrefix = 'Field required';
      }
      return errors;
    },
    validateOnBlur: true,
    onSubmit: () => {
      navigate('/create-collection/nft-attributes');
    }
  });

  const value = useMemo(() => ({
    attributes,
    avatarImg,
    coverImgFile,
    coverImgAddress,
    description,
    mainInformationForm,
    mintFest,
    name,
    ownerCanDestroy,
    ownerCanTransfer,
    setAttributes,
    setAvatarImg,
    setCoverImgFile,
    setCoverImgAddress,
    setDescription,
    setMintFest,
    setName,
    setOwnerCanDestroy,
    setOwnerCanTransfer,
    setTokenImg,
    setTokenLimit,
    setTokenPrefix,
    setVariableSchema,
    tokenImg,
    tokenLimit,
    tokenPrefix,
    variableSchema
  }), [attributes, avatarImg, coverImgFile, coverImgAddress, description, mainInformationForm, mintFest, name, ownerCanDestroy, ownerCanTransfer, tokenImg, tokenLimit, tokenPrefix, variableSchema]);

  return (
    <CollectionFormContext.Provider value={value}>
      {children}
    </CollectionFormContext.Provider>
  );
}

export * from './CollectionFormContext';
