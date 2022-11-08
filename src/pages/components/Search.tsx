import styled from 'styled-components';
import { ComponentProps } from '@unique-nft/ui-kit';

import { InputBaseProps, InputText } from '@app/components';

type SearchProps = Pick<ComponentProps, 'className' | 'value' | 'onKeyDown'> &
  Pick<InputBaseProps, 'onChange'>;

const Wrapper = styled.div`
  .unique-input-text {
    width: 100%;

    .input-wrapper {
      &:hover {
        border: 1px solid var(--color-grey-500);
      }

      &.with-icon {
        &.to-left:not(.to-right) {
          input {
            padding-top: 7px;
            padding-bottom: 7px;
          }
        }
      }
    }
  }
`;

export const Search = ({ className, value, onChange, onKeyDown }: SearchProps) => {
  return (
    <Wrapper className={className}>
      <InputText
        iconLeft={{ name: 'magnify', size: 18, color: 'var(--color-blue-grey-500)' }}
        value={value}
        placeholder="Search"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </Wrapper>
  );
};
