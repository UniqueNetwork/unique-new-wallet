import { VFC, useMemo, useContext, useState } from 'react';
import { InputText, Select, SelectOptionProps } from '@unique-nft/ui-kit';

import { TokenField } from '@app/types';
import { TokenFormContext } from '@app/context';
import { FormRow, LabelText } from '@app/pages/components/FormComponents';

interface AttributesRowProps {
  tokenField: TokenField;
  maxLength: number;
}

export interface IOption extends SelectOptionProps {
  id: string;
  title: string;
}

const createOptionsByFiled = (tokenField: TokenField): IOption[] =>
  tokenField.items?.map((val: string, index: number) => ({
    title: JSON.parse(val).en as string,
    id: index.toString(),
  })) ?? [];

export const AttributesRow: VFC<AttributesRowProps> = ({ tokenField, maxLength }) => {
  const { tokenForm } = useContext(TokenFormContext);

  const { setFieldValue, values, errors, touched } = tokenForm;

  const onSetAttributeValue = (value: string) => {
    setFieldValue(tokenField.name, value);
  };

  const onSetMultiSelectValue = (value: IOption[]) => {
    setFieldValue(tokenField.name, value);
  };

  const onSetSelectValue = (value: IOption) => {
    setFieldValue(tokenField.name, [value]);
  };

  const options = useMemo(() => {
    try {
      if (tokenField.type === 'select' && tokenField?.items?.length) {
        return createOptionsByFiled(tokenField);
      }
    } catch (e) {
      console.log('token field parse error', e);
    }

    return [];
  }, [tokenField]);

  return (
    <FormRow>
      {tokenField.type === 'text' && (
        <>
          <LabelText>
            {tokenField.name}
            {tokenField.required && '*'}
          </LabelText>
          <InputText
            error={touched[tokenField.name] && Boolean(errors[tokenField.name])}
            name={tokenField.name}
            maxLength={maxLength}
            value={values[tokenField.name]}
            onChange={onSetAttributeValue}
          />
        </>
      )}
      {tokenField.type === 'select' && (
        <>
          <LabelText>
            {tokenField.name}
            {tokenField.required && '*'}
          </LabelText>
          {tokenField.multi ? (
            <Select
              multi
              error={touched[tokenField.name] && Boolean(errors[tokenField.name])}
              name={tokenField.name}
              options={options}
              optionKey="id"
              optionValue="title"
              values={values[tokenField.name]?.map(({ id }: { id: string }) => id)}
              onChange={(options: IOption[]) => onSetMultiSelectValue(options)}
            />
          ) : (
            <Select
              error={touched[tokenField.name] && Boolean(errors[tokenField.name])}
              options={options}
              optionKey="id"
              optionValue="title"
              value={values[tokenField.name]?.[0]?.id}
              onChange={(option: IOption) => onSetSelectValue(option)}
            />
          )}
        </>
      )}
    </FormRow>
  );
};
