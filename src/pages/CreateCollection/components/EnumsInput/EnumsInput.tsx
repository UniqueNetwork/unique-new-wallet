import { useState } from 'react';
import styled from 'styled-components';

import EnumInputItem from './EnumInputItem';

export type EnumsInputProps<T> = {
  isDisabled?: boolean;
  maxSymbols?: number;
  onChange?: (values: string[]) => void;
  onAdd?(value: string): void;
  onDelete?(index: number): void;
  value?: T[];
  getValues(values?: T[]): string[] | null | undefined;
};

export const EnumsInput = <T,>({
  isDisabled,
  maxSymbols,
  onChange,
  onAdd,
  onDelete,
  value: inputValue,
  getValues,
}: EnumsInputProps<T>) => {
  const [currentEnum, setCurrentEnum] = useState<string>('');

  const value = getValues(inputValue) ?? [];

  const addItem = () => {
    if (!currentEnum) {
      return;
    }

    if (
      currentEnum.length &&
      !value.find((item: string) => item.toLowerCase() === currentEnum.toLowerCase())
    ) {
      onChange?.([...value, currentEnum]);
      onAdd?.(currentEnum);
      setCurrentEnum('');
    } else {
      alert('Warning. You are trying to add already existed item');
      setCurrentEnum('');
    }
  };

  const deleteItem = (enumItem: number) => {
    if (isDisabled) {
      return;
    }

    onChange?.(value?.filter((item: string, idx) => idx !== enumItem));
    onDelete?.(enumItem);
  };

  const changeCurrentEnum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (maxSymbols && val?.length > maxSymbols) {
      return;
    }

    setCurrentEnum(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  return (
    <Wrapper className={`${isDisabled ? 'enum-input disabled' : 'enum-input'}`}>
      <div className="enum-input--content">
        <div className="enum-input--content--elements">
          {value?.map((enumItem: string, idx) => (
            <EnumInputItem
              deleteItem={deleteItem}
              enumItem={enumItem}
              key={enumItem}
              idx={idx}
            />
          ))}
        </div>
        <input
          className="enum-input--input"
          disabled={isDisabled}
          placeholder={isDisabled ? 'Values' : ''}
          type="text"
          value={currentEnum}
          onBlur={addItem}
          onChange={changeCurrentEnum}
          onKeyDown={onKeyDown}
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  &.enum-input {
    box-sizing: border-box;
    border: 1px solid var(--color-grey-300);
    background: white;
    border-radius: calc(var(--gap) / 4);
    width: 100%;
    padding: 4px 8px;
    min-height: 30px;

    &.disabled {
      background: var(--color-blue-grey-100);
      border: 1px solid var(--color-blue-grey-100);

      .enum-input--content {
        background: var(--color-blue-grey-100);

        input.enum-input--input {
          background: var(--color-blue-grey-100) !important;
        }
      }
    }

    .enum-input--content {
      display: flex;
      flex-direction: column;
      align-items: center;
      grid-column-gap: 4px;

      &--elements {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        grid-column-gap: 5px;
        grid-row-gap: 5px;
      }
    }

    input.enum-input--input {
      border: none;
      width: 100%;
      background: white;
      min-width: 100px;
      line-height: 30px;

      &:active,
      &:hover,
      &:focus {
        outline: none;
      }
    }
  }
`;
