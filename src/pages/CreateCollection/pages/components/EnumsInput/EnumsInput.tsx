import React, { VFC, useState } from 'react';
import styled from 'styled-components';

import EnumInputItem from './EnumInputItem';

interface Props {
  isDisabled?: boolean;
  maxSymbols?: number;
  setValues: (values: string[]) => void;
  values: string[];
}

export const EnumsInput: VFC<Props> = ({ isDisabled, maxSymbols, setValues, values }) => {
  const [currentEnum, setCurrentEnum] = useState<string>('');

  const addItem = () => {
    if (!currentEnum) {
      return;
    }

    if (
      currentEnum.length &&
      !values.find((item: string) => item.toLowerCase() === currentEnum.toLowerCase())
    ) {
      setValues([...values, currentEnum]);
      setCurrentEnum('');
    } else {
      alert('Warning. You are trying to add already existed item');
      setCurrentEnum('');
    }
  };

  const deleteItem = (enumItem: string) => {
    if (isDisabled) {
      return;
    }

    setValues(
      values.filter((item: string) => item.toLowerCase() !== enumItem.toLowerCase()),
    );
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
          {values.map((enumItem: string) => (
            <EnumInputItem deleteItem={deleteItem} enumItem={enumItem} key={enumItem} />
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
