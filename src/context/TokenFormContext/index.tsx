// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { TokenAttributes, TokenField } from '@app/types';

import TokenFormContext from './TokenFormContext';
import { createDynamicYupSchema } from './createDynamicYupSchema';
import {
  createDynamicInitialState,
  CreateNftInitialValues,
} from './createDynamicInitialState';

interface Props {
  children: React.ReactNode;
}

interface YupSchemaDefaultInterface {
  [key: string]: any;
}

export function TokenForm({ children }: Props): React.ReactElement<Props> | null {
  const [attributes, setAttributes] = useState<TokenAttributes>({});
  const [tokenImg, setTokenImg] = useState<Blob | null>(null);
  const [schema, setSchema] = useState<Yup.SchemaOf<YupSchemaDefaultInterface>>();
  const [initialValues, setInitialValues] = useState<CreateNftInitialValues>({});

  const createSchema = (tokenFields: TokenField[]) => {
    const dynamicSchema = createDynamicYupSchema(tokenFields);

    setSchema(dynamicSchema);
  };

  const createInitialValues = (tokenFields: TokenField[]) => {
    const initialState = createDynamicInitialState(tokenFields);

    setInitialValues(initialState);
  };

  const initializeTokenForm = (tokenFields: TokenField[]) => {
    createSchema(tokenFields);
    createInitialValues(tokenFields);
  };

  const resetForm = useCallback(() => {
    setAttributes({});
    setTokenImg(null);
  }, []);

  const tokenForm = useFormik({
    initialValues,
    validationSchema: schema,
    validateOnBlur: true,
    onSubmit: () => {},
  });

  const value = useMemo(
    () => ({
      attributes,
      initializeTokenForm,
      tokenForm,
      setAttributes,
      setTokenImg,
      tokenImg,
      resetForm,
    }),
    [attributes, initializeTokenForm, tokenForm, tokenImg, resetForm],
  );

  return <TokenFormContext.Provider value={value}>{children}</TokenFormContext.Provider>;
}

export * from './TokenFormContext';
