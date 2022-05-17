import { SuggestItemProps } from '@unique-nft/ui-kit/dist/cjs/components/Suggest/components';
import classNames from 'classnames';
import styled from 'styled-components/macro';

import { TestSuggestValues } from '@app/components/SuggestGroup/SuggestGroup';
// TODO: test image for static
import nft1 from '@app/static/nft-1.png';

export const SuggestItem = ({
  suggestion,
  isActive,
}: SuggestItemProps<TestSuggestValues>) => {
  return (
    <div
      className={classNames('suggestion-item', {
        isActive,
      })}
    >
      <Item>
        <Image group={suggestion.group} src={nft1} alt="image" />

        <div>
          {suggestion.title}
          {suggestion.group === 1 ? `#${suggestion.id}` : `[id ${suggestion.id}]`}
        </div>
      </Item>
    </div>
  );
};

const Image = styled.img<{ group: number }>`
  width: 24px;
  height: 24px;
  border-radius: ${(props) => (props.group === 1 ? '2px' : '50%')};
  margin-right: 10px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
`;
