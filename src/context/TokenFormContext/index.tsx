// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { TokenAttributes } from '@app/types';

import TokenFormContext from './TokenFormContext';

interface Props {
  children: React.ReactNode;
}

export function TokenForm({ children }: Props): React.ReactElement<Props> | null {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState<TokenAttributes>({});
  const [tokenImg, setTokenImg] = useState<Blob | null>(null);

  const schema = Yup.object({
    name: Yup.string().min(2, 'Too Short!').max(64, 'Too Long!').required('Required'),
    description: Yup.string().min(2, 'Too Short!').max(256, 'Too Long!'),
    tokenPrefix: Yup.string()
      .min(2, 'Too Short!')
      .max(4, 'Too Long!')
      .required('Required'),
    coverImgAddress: Yup.string(),
  });

  const tokenForm = useFormik({
    initialValues: {},
    validationSchema: schema,
    validateOnBlur: true,
    onSubmit: () => {
      navigate('/create-collection/nft-attributes');
    },
  });

  const value = useMemo(
    () => ({
      attributes,
      tokenForm,
      setAttributes,
      setTokenImg,
      tokenImg,
    }),
    [attributes, tokenForm, tokenImg],
  );

  return <TokenFormContext.Provider value={value}>{children}</TokenFormContext.Provider>;
}

export * from './TokenFormContext';
