// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { ArtificialAttributeItemType, MainInformationInitialValues } from '@app/types';
import { maxTokenLimit } from '@app/pages/constants/token';
import { useApi } from '@app/hooks';

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

  const value = useMemo(
    () => ({
      attributes,
      coverImgFile,
      mainInformationForm,
      ownerCanDestroy,
      ownerCanTransfer,
      setAttributes,
      setCoverImgFile,
      setOwnerCanDestroy,
      setOwnerCanTransfer,
      setTokenLimit,
      setVariableSchema,
      tokenLimit,
      variableSchema,
    }),
    [
      attributes,
      coverImgFile,
      mainInformationForm,
      ownerCanDestroy,
      ownerCanTransfer,
      tokenLimit,
      variableSchema,
    ],
  );

  return (
    <CollectionFormContext.Provider value={value}>
      {children}
    </CollectionFormContext.Provider>
  );
}

export * from './CollectionFormContext';
