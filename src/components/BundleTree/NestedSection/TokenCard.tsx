import { FC, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { Dropdown, Icon, Loader, Text, Tooltip } from '@unique-nft/ui-kit';

import MeatBallIcon from 'static/icons/meatball.svg';

import { Image } from '@app/components';

import { INestingToken, ITokenCard } from '../types';
import { useCollection } from '../useCollection';

function TokenCard({
  token,
  onViewNodeDetails,
  onUnnestClick,
  onTransferClick,
}: ITokenCard) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { isCollectionLoading, collection } = useCollection(token.collectionId);
  const meatballIconMenu = useRef(null);

  const onTransfer = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onTransferClick?.(token);
      event.stopPropagation();
    },
    [token, onTransferClick],
  );

  const onUnnest = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onUnnestClick?.({ ...token, name: `${collection?.tokenPrefix} #${token.tokenId}` });
      event.stopPropagation();
    },
    [onUnnestClick, token, collection?.tokenPrefix],
  );

  const showMenu = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const hideMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const viewTokenDetails = useCallback(() => {
    onViewNodeDetails?.(token);
  }, [onViewNodeDetails, token]);

  return (
    <TokenCardWrapper
      onMouseEnter={showMenu}
      onMouseLeave={hideMenu}
      onClick={viewTokenDetails}
    >
      <Image
        alt={`T-${token.tokenId} C-${token.collectionId}`}
        className="picture"
        image={
          // @ts-ignore
          (typeof token.image === 'string' ? token.image : token.image?.fullUrl) ||
          undefined
        }
      />
      <TokenTitle
        token={token}
        mode={collection?.mode || ''}
        prefix={collection?.tokenPrefix || ''}
        isCollectionLoading={isCollectionLoading}
      />
      {token.nestingChildTokens && (
        <Text color="grey-500" size="xs">
          {token.nestingChildTokens.length} item
          {token.nestingChildTokens.length > 1 && 's'}
        </Text>
      )}
      {menuVisible && token.isCurrentAccountOwner && (
        <ActionsMenuWrapper
          className="menu"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Tooltip
            align={{ vertical: 'top', horizontal: 'middle', appearance: 'vertical' }}
            targetRef={meatballIconMenu}
          >
            Open additional menu
          </Tooltip>
          <Dropdown
            placement="left"
            dropdownRender={() => (
              <DropdownMenu>
                <TransferMenuItem onClick={onTransfer}>
                  Transfer
                  <IconWrapper>
                    <Icon
                      name="sorting-initial"
                      size={16}
                      color="var(--color-primary-500)"
                    />
                  </IconWrapper>
                </TransferMenuItem>
                <UnnestMenuItem onClick={onUnnest}>
                  Unnest token
                  <IconWrapper>
                    <Icon name="logout" size={16} color="var(--color-coral-500)" />
                  </IconWrapper>
                </UnnestMenuItem>
              </DropdownMenu>
            )}
          >
            <Icon
              size={32}
              file={MeatBallIcon}
              color="transparent"
              ref={meatballIconMenu}
            />
          </Dropdown>
        </ActionsMenuWrapper>
      )}
    </TokenCardWrapper>
  );
}

const TokenCardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
  cursor: pointer;
  border-radius: calc(var(--prop-border-radius) * 2);
  background-color: var(--color-additional-light);

  .picture {
    width: 128px;
    height: 128px;
  }

  span:first-of-type,
  span:last-of-type {
    margin-top: calc(var(--gap) / 2);
  }

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);

    .menu {
      display: flex;
    }
  }
`;

const ActionsMenuWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;

  div[class*='DropdownMenuButtonWrapper'] {
    & > button {
      padding: 4px;
      background-color: var(--color-additional-dark);
      border: 2px solid #ffffff;
      border-radius: var(--prop-border-radius);
      color: var(--color-additional-light);
      height: 32px;

      &:hover {
        background-color: var(--color-additional-dark);
      }
    }

    & > img {
      display: none;
    }
  }

  div[class*='DropdownMenuDropdown'] {
    width: max-content;

    & > div {
      padding: calc(var(--gap) / 2) var(--gap);
      display: flex;
    }
  }
`;

const DropdownMenu = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-width: 138px;
`;

const DropdownMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;

  &:hover {
    background: var(--color-primary-100);
  }
`;

const TransferMenuItem = styled(DropdownMenuItem)`
  border-bottom: 1px dashed var(--color-grey-300);
  color: var(--color-primary-500);

  &:hover {
    color: var(--color-primary-600);
  }
`;

const UnnestMenuItem = styled(DropdownMenuItem)`
  color: var(--color-coral-500);

  &:hover {
    background-color: var(--color-coral-100);
  }
`;

const IconWrapper = styled.div`
  && {
    width: 16px;
    height: 16px;
    margin-left: calc(var(--prop-gap) / 4);
    transform: rotate(-90deg);

    path {
      stroke: currentColor;
    }
  }
`;

export default TokenCard;

const TokenTitle: FC<{
  isCollectionLoading: boolean;
  prefix: string;
  token: INestingToken;
  mode: string;
}> = ({ isCollectionLoading, prefix, token, mode }) => {
  if (isCollectionLoading) {
    return <Loader size="large" />;
  }
  return (
    <>
      <Text color="additional-dark" size="m">
        {prefix} #{token.tokenId}
      </Text>
      <Text color="grey-500" size="s">
        {mode}
      </Text>
    </>
  );
};
