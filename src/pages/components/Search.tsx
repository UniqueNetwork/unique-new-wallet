import styled from 'styled-components';

import { ComponentProps } from '@app/components/types';
import { InputBaseProps, InputText, Button } from '@app/components';

type SearchProps = Pick<ComponentProps, 'className' | 'value' | 'onKeyDown'> &
  Pick<InputBaseProps, 'onChange'> & {
    hideButton?: boolean;
    onClick?: () => void;
    onClear?: () => void;
  };

const Wrapper = styled.div<{ hideButton: boolean }>`
  display: flex;
  gap: calc(var(--prop-gap) / 2);
  position: relative;
  @media screen and (min-width: 1024px) {
    flex-basis: 570px;
  }

  .unique-input-text {
    width: 100%;
    height: 40px;

    .input-wrapper {
      height: 38px;
      &:hover {
        border: 1px solid var(--color-grey-500);
      }

      &.with-icon {
        input {
          padding-top: 7px !important;
          padding-bottom: 7px !important;
        }
      }
      button.unique-button.with-icon.to-right {
        margin-right: ${({ hideButton }) => (hideButton ? '8px' : '36px')};
      }
    }
  }
`;

export const Search = ({
  className,
  value,
  hideButton = false,
  onChange,
  onKeyDown,
  onClick,
  onClear,
}: SearchProps) => {
  return (
    <Wrapper className={className} hideButton={hideButton}>
      <InputText
        clearable
        value={value}
        placeholder="Search"
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClear={onClear}
      />
      {!hideButton && (
        <ButtonWrapper>
          <Button
            title=""
            role="ghost"
            iconLeft={{ name: 'magnify', size: 18, color: 'var(--color-primary-500)' }}
            onClick={onClick}
          />
        </ButtonWrapper>
      )}
    </Wrapper>
  );
};

const ButtonWrapper = styled.div`
  position: absolute;
  right: calc(var(--prop-gap) / 4);
  button.unique-button.ghost {
    padding: 0;
  }
`;
