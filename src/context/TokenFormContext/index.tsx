// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { TokenAttributes, TokenField } from '@app/types';

import TokenFormContext from './TokenFormContext';
import { createDynamicYupSchema } from './createDynamicYupSchema';

interface Props {
  children: React.ReactNode;
}

interface YupSchemaDefaultInterface {
  [key: string]: any;
}

export function TokenForm({ children }: Props): React.ReactElement<Props> | null {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState<TokenAttributes>({});
  const [tokenImg, setTokenImg] = useState<Blob | null>(null);
  const [schema, setSchema] = useState<Yup.SchemaOf<YupSchemaDefaultInterface>>();

  const createSchema = (tokenFields: TokenField[]) => {
    const dynamicSchema = createDynamicYupSchema(tokenFields);

    setSchema(dynamicSchema);
  };

  const resetForm = useCallback(() => {
    setAttributes({});
    setTokenImg(null);
  }, []);

  const tokenForm = useFormik({
    initialValues: {
      ipfsJson: '',
    },
    validationSchema: schema,
    validateOnBlur: true,
    onSubmit: () => {
      navigate('/my-tokens/nft');
    },
  });

  const value = useMemo(
    () => ({
      attributes,
      createSchema,
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
