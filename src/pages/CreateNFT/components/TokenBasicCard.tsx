import { id } from 'date-fns/locale';
import styled from 'styled-components';

import { Button } from '@app/components';

import trash from '../../../static/icons/trash.svg';
import { Checkbox } from '../../../components/Checkbox';
import { Image } from '../../../components/Image';
import { Typography } from '../../../components/Typography';
import { NewToken } from '../types';

type TokenBasicCardProps = {
  onChange?(token: NewToken): void;
  onRemove?(): void;
  token: NewToken;
  tokenPrefix: string;
};

export const TokenBasicCard = ({
  token,
  tokenPrefix,
  onChange,
  onRemove,
}: TokenBasicCardProps) => {
  const onSelect = () => {
    onChange?.({ ...token, isSelected: !token.isSelected });
  };

  return (
    <TokenBasicWrapper>
      <TokenLinkImageWrapper>
        <TokenImage alt={`${tokenPrefix}_${id}`} image={token.image.url} />
        {!!onChange && (
          <SelectCheckbox label="" checked={token.isSelected} onChange={onSelect} />
        )}
      </TokenLinkImageWrapper>
      <TokenCardActions>
        <TokenLinkTitle>{`${tokenPrefix} #${token.tokenId}`}</TokenLinkTitle>
        {onRemove && (
          <Button
            title=""
            role="ghost"
            iconLeft={{ file: trash, size: 24 }}
            onClick={onRemove}
          />
        )}
      </TokenCardActions>
    </TokenBasicWrapper>
  );
};

const TokenBasicWrapper = styled.div`
  display: block;

  min-width: 300px;
`;

const TokenLinkImageWrapper = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
`;

const TokenImage = styled(Image)`
  margin-bottom: calc(var(--prop-gap) / 2);
`;

const TokenCardActions = styled.div`
  padding: calc(var(--prop-gap) / 2) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 250px;
  background-color: white;
  .unique-button {
    padding: 0;
  }
`;

const TokenLinkTitle = styled(Typography).attrs({ appearance: 'block', size: 'l' })`
  word-break: break-all;
`;
const SelectCheckbox = styled(Checkbox)`
  position: absolute;
  top: var(--prop-gap);
  left: var(--prop-gap);
  &.unique-checkbox-wrapper.checkbox-size-s span.checkmark {
    height: 32px;
    width: 32px;
    border-radius: var(--prop-gap);
    background-color: var(--color-primary-500);
    opacity: 0.4;
    &.checked {
      opacity: 1;
    }
  }
`;
