import { VFC, useMemo, useContext, useState } from 'react';
import { InputText, Select, SelectOptionProps } from '@unique-nft/ui-kit';

import { TokenField } from '@app/types';
import { TokenFormContext } from '@app/context';
import { FormRow, LabelText } from '@app/pages/components/FormComponents';

interface AttributesRowProps {
  tokenField: TokenField;
  maxLength: number;
}

interface IOption extends SelectOptionProps {
  id: string;
  title: string;
}

const createOptionsByFiled = (tokenField: TokenField): IOption[] =>
  tokenField.items?.map((val: string, index: number) => ({
    title: JSON.parse(val).en as string,
    id: index.toString(),
  })) ?? [];

const createValueByField = (tokenField: TokenField, value: string): IOption | undefined =>
  createOptionsByFiled(tokenField)?.find((item: IOption) => value === item.title);

const createMultiValueByField = (tokenField: TokenField, values: string[]): IOption[] =>
  createOptionsByFiled(tokenField)?.filter((item: IOption) =>
    values?.includes(item.title),
  );

export const AttributesRow: VFC<AttributesRowProps> = ({ tokenField, maxLength }) => {
  const { attributes, setAttributes } = useContext(TokenFormContext);
  const [multiSelectValue, setMultiSelectValue] = useState<IOption[]>(() =>
    createMultiValueByField(tokenField, attributes[tokenField.name] as string[]),
  );
  const [selectValue, setSelectValue] = useState<IOption | undefined>(() =>
    createValueByField(tokenField, attributes[tokenField.name] as string),
  );

  const onSetAttributeValue = (value: string) => {
    setAttributes({
      ...attributes,
      [tokenField.name]: value,
    });
  };

  const setAttributesFromSelect = (value: IOption) => {
    setAttributes({
      ...attributes,
      [tokenField.name]: [value?.title],
    });
  };

  const setAttributesFromMultiSelect = (value: IOption[]) => {
    setAttributes({
      ...attributes,
      [tokenField.name]: value?.map((val) => val.title),
    });
  };

  const onSetMultiSelectValue = (value: IOption[]) => {
    setMultiSelectValue(value);

    setAttributesFromMultiSelect(value);
  };

  const onSetSelectValue = (value: IOption) => {
    setSelectValue(value);

    setAttributesFromSelect(value);
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
            {attributes.name}
            {attributes.rule === 'required' && '*'}
          </LabelText>
          <InputText
            name={tokenField.name}
            maxLength={maxLength}
            value={
              tokenField.type === 'text' ? (attributes[tokenField.name] as string) : ''
            }
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
              name={tokenField.name}
              options={options}
              optionKey="id"
              optionValue="title"
              values={multiSelectValue?.map(({ id }) => id)}
              onChange={(options: IOption[]) => onSetMultiSelectValue(options)}
            />
          ) : (
            <Select
              options={options}
              optionKey="id"
              optionValue="title"
              value={selectValue?.id}
              onChange={(option: IOption) => onSetSelectValue(option)}
            />
          )}
        </>
      )}
    </FormRow>
  );
};
