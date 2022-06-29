// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';
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

  // TODO - move token to Formik
  const schema = Yup.object({
    ipfsJson: Yup.string().required('Required'),
  });

  const resetForm = useCallback(() => {
    setAttributes({});
    setTokenImg(null);
  }, []);

  const tokenForm = useFormik({
    initialValues: {},
    validationSchema: schema,
    validateOnBlur: true,
    onSubmit: () => {
      navigate('/');
    },
  });

  const value = useMemo(
    () => ({
      attributes,
      tokenForm,
      setAttributes,
      setTokenImg,
      tokenImg,
      resetForm,
    }),
    [attributes, tokenForm, tokenImg, resetForm],
  );

  return <TokenFormContext.Provider value={value}>{children}</TokenFormContext.Provider>;
}

export * from './TokenFormContext';
