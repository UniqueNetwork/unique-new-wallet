// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import {
  ArtificialAttributeItemType,
  AttributeItemType,
  MainInformationInitialValues,
  NftCollectionDTO,
  ProtobufAttributeType,
} from '@app/types';
import { maxTokenLimit } from '@app/pages/constants/token';
import { useApi } from '@app/hooks';
import { convertArtificialAttributesToProtobuf, fillProtobufJson } from '@app/utils';

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
    values: [],
  },
];

export function CollectionForm({ children }: Props): React.ReactElement<Props> | null {
  const navigate = useNavigate();
  const { currentChain } = useApi();
  const [attributes, setAttributes] = useState<ArtificialAttributeItemType[]>(
    defaultAttributesWithTokenIpfs,
  );
  const [coverImgFile, setCoverImgFile] = useState<Blob | null>(null);
  const [ownerCanTransfer, setOwnerCanTransfer] = useState<boolean>(false);
  const [ownerCanDestroy, setOwnerCanDestroy] = useState<boolean>(true);
  const [tokenLimit, setTokenLimit] = useState<number | null>(null);
  const [variableSchema, setVariableSchema] = useState<string>('');

  const mainInformationDefaultValues: MainInformationInitialValues = {
    name: undefined,
    description: undefined,
    tokenPrefix: undefined,
    coverImgAddress: undefined,
  };

  const schema = Yup.object({
    name: Yup.string().min(2, 'Too Short!').max(64, 'Too Long!').required('Required'),
    description: Yup.string().min(2, 'Too Short!').max(256, 'Too Long!'),
    tokenPrefix: Yup.string()
      .min(2, 'Too Short!')
      .max(4, 'Too Long!')
      .required('Required'),
    coverImgAddress: Yup.string(),
    limits: Yup.object({
      tokenLimit: Yup.number()
        .min(1)
        .max(maxTokenLimit, 'Too long number!')
        .nullable(true),
    }),
  });

  const mainInformationForm = useFormik({
    initialValues: mainInformationDefaultValues,
    validationSchema: schema,
    validateOnBlur: true,
    onSubmit: () => {
      navigate(`/${currentChain?.network}/create-collection/nft-attributes`);
    },
  });

  const mapFormToCollectionDto = (address: string) => {
    const converted: AttributeItemType[] =
      convertArtificialAttributesToProtobuf(attributes);
    const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);
    const varDataWithImage = {
      collectionCover: mainInformationForm.values.coverImgAddress,
    };

    const collectionFull: NftCollectionDTO = {
      address,
      description: mainInformationForm.values.description ?? '',
      limits: {
        ownerCanDestroy,
        ownerCanTransfer,
        tokenLimit,
      },
      metaUpdatePermission: 'ItemOwner',
      mode: 'Nft',
      name: mainInformationForm.values.name ?? '',
      properties: {
        offchainSchema: '',
        schemaVersion: 'Unique',
        variableOnChainSchema: JSON.stringify(varDataWithImage),
        constOnChainSchema: protobufJson,
      },
      tokenPrefix: mainInformationForm.values.tokenPrefix ?? '',
      permissions: {
        access: 'Normal',
        mintMode: true,
        nesting: 'Disabled',
      },
      tokenPropertyPermissions: {
        constData: {
          mutable: true,
          collectionAdmin: true,
          tokenOwner: true,
        },
      },
    };

    return collectionFull;
  };

  const value = useMemo(
    () => ({
      attributes,
      tokenLimit,
      coverImgFile,
      variableSchema,
      mainInformationForm,
      ownerCanDestroy,
      ownerCanTransfer,
      setAttributes,
      setCoverImgFile,
      setOwnerCanDestroy,
      setOwnerCanTransfer,
      setTokenLimit,
      setVariableSchema,
      mapFormToCollectionDto,
    }),
    [
      attributes,
      coverImgFile,
      mainInformationForm,
      ownerCanDestroy,
      ownerCanTransfer,
      tokenLimit,
      variableSchema,
      mapFormToCollectionDto,
    ],
  );

  return (
    <CollectionFormContext.Provider value={value}>
      {children}
    </CollectionFormContext.Provider>
  );
}

export * from './CollectionFormContext';
