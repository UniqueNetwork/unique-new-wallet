import { VFC, useMemo, useContext, useState } from 'react';
import { InputText, Select, SelectOptionProps } from '@unique-nft/ui-kit';

import { TokenAttributes, TokenField } from '@app/types';
import { TokenFormContext } from '@app/context';

import { FormRow, LabelText } from './components';

interface AttributesRowProps {
  tokenField: TokenField;
  maxLength: number;
}

interface IOption extends SelectOptionProps {
  id: string;
  title: string;
}

export const AttributesRow: VFC<AttributesRowProps> = ({ tokenField, maxLength }) => {
  const { attributes, setAttributes } = useContext(TokenFormContext);
  const [textValue, setTextValue] = useState<string>(() =>
    tokenField.type === 'text' ? (attributes[tokenField.name] as string) : '',
  );
  const [multiSelectValue, setMultiSelectValue] = useState<IOption[]>([]);
  const [selectValue, setSelectValue] = useState<IOption>();

  const onSetAttributeValue = () => {
    console.log('textValue', textValue);
    // setAttributeValue(collectionAttribute, value);
  };

  const onSetAttributesMultiValue = (option: Array<{ title: string; id: number }>) => {
    console.log('option multi', option);

    /* const newAttributes = { ...attributes };

    setAttributes({
      ...newAttributes,
      [tokenField.name]: [
        ...(option as unknown as Array<{ title: string; id: string }>).map(
          (optionItem: { title: string; id: string }) => optionItem.title,
        ),
      ] as string[],
    }); */

    // setValue(option.map((item) => item.id.toString()));
  };

  const onSelectAttributeValue = (option: SelectOptionProps) => {
    console.log('option', option);

    const newAttributes = { ...attributes };

    setAttributes({
      ...newAttributes,
      [tokenField.name]: [option.title as string],
    });
  };

  const options = useMemo(() => {
    try {
      if (tokenField.type === 'select' && tokenField?.items?.length) {
        return tokenField.items.map((val: string, index: number) => ({
          title: JSON.parse(val).en,
          id: index,
        }));
      }
    } catch (e) {
      console.log('token field parse error', e);
    }

    return [];
  }, [tokenField]);

  /* const value =
    tokenField.type === 'select' ? (attributes[tokenField.name] as string[]) : []; */

  console.log(
    'selectValue',
    selectValue,
    'collectionField',
    tokenField,
    'options',
    options,
  );

  return (
    <FormRow>
      {tokenField.type === 'text' && (
        <>
          <LabelText>
            {attributes.name}
            {attributes.rule === 'required' && '*'}
          </LabelText>
          <InputText
            maxLength={maxLength}
            value={textValue}
            onChange={setTextValue}
            onBlur={onSetAttributeValue}
          />
        </>
      )}
      {tokenField.type === 'select' && (
        <>
          <LabelText>
            {tokenField.name}
            {tokenField.required && '*'}
          </LabelText>
          {tokenField.multi && (
            <Select
              multi
              options={options}
              optionKey="id"
              optionValue="title"
              values={multiSelectValue?.map(({ id }) => id)}
              onChange={(options: IOption[]) => setMultiSelectValue(options)}
            />
          )}
          {!tokenField.multi && (
            <Select
              options={options}
              optionKey="id"
              optionValue="title"
              value={selectValue?.id}
              onChange={(option: IOption) => setSelectValue(option)}
            />
          )}
        </>
      )}
    </FormRow>
  );
};
