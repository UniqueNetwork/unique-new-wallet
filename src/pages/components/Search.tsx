import styled from 'styled-components';
import { Button, ComponentProps } from '@unique-nft/ui-kit';

import { Icon, InputBaseProps, InputText } from '@app/components';

type SearchProps = Pick<ComponentProps, 'className' | 'value' | 'onKeyDown'> &
  Pick<InputBaseProps, 'onChange'> & {
    onClick?: () => void;
    onClear?: () => void;
  };

const Wrapper = styled.div`
  display: flex;
  gap: calc(var(--prop-gap) / 2);

  .unique-input-text {
    width: 100%;

    .input-wrapper {
      &:hover {
        border: 1px solid var(--color-grey-500);
      }

      &.with-icon {
        input {
          padding-top: 7px !important;
          padding-bottom: 7px !important;
        }
      }
    }
  }
  button.unique-button.primary {
    display: none;
    @media screen and (min-width: 1024px) {
      display: flex;
    }
  }
`;

export const Search = ({
  className,
  value,
  onChange,
  onKeyDown,
  onClick,
  onClear,
}: SearchProps) => {
  return (
    <Wrapper className={className}>
      <InputText
        clearable
        iconLeft={{ name: 'magnify', size: 18, color: 'var(--color-blue-grey-500)' }}
        value={value}
        placeholder="Search"
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClear={onClear}
      />
      <Button role="primary" type="button" title="Search" onClick={onClick} />
    </Wrapper>
  );
};
