import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Dropdown, Icon, Loader } from '@unique-nft/ui-kit';
import { useParams } from 'react-router-dom';

import Pin from 'static/icons/pin.svg';
import MeatBallIcon from 'static/icons/meatball.svg';
import SquareIcon from 'static/icons/square.svg';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { TooltipWrapper } from '@app/components';

import { Picture } from '../../Picture';
import { INestingToken, INodeView } from '../types';
import MobileModalActions from './MobileModalActions';
import { useCollection } from '../useCollection';

const NodeView: FC<INodeView<INestingToken>> = ({
  arrowClicked,
  isOpened,
  data,
  textClicked,
  isFirst,
  level,
  isSelected,
  isParentSelected,
  children,
  onViewNodeDetails,
  onTransferClick,
  onUnnestClick,
}) => {
  const { tokenId, collectionId } = useParams<{
    tokenId: string;
    collectionId: string;
  }>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const deviceSize = useDeviceSize();
  const { isCollectionLoading, collection } = useCollection(data.collectionId);

  const isMobileView = [DeviceSize.sm, DeviceSize.md, DeviceSize.xs].includes(deviceSize);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      isMobileView ? setModalVisible(true) : textClicked(event);
    },
    [isMobileView, textClicked],
  );

  const onTransfer = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onTransferClick?.(data);
      event.stopPropagation();
    },
    [onTransferClick, data],
  );

  const onUnnest = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onUnnestClick?.({ ...data, name: `${collection?.tokenPrefix} #${data.tokenId}` });
      event.stopPropagation();
    },
    [onUnnestClick, data, collection?.tokenPrefix],
  );

  const showMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setMenuVisible(true);
    event.stopPropagation();
  }, []);

  const hideMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const tokenMenuActions = useMemo(() => {
    return (
      <>
        <TransferMenuItem onClick={onTransfer}>
          Transfer
          <IconWrapper>
            <Icon name="sorting-initial" size={16} color="var(--color-primary-500)" />
          </IconWrapper>
        </TransferMenuItem>
        {level !== 1 && (
          <UnnestMenuItem onClick={onUnnest}>
            Unnest token
            <IconWrapper>
              <Icon name="logout" size={16} color="var(--color-coral-500)" />
            </IconWrapper>
          </UnnestMenuItem>
        )}
      </>
    );
  }, [onTransfer, onUnnest]);

  const viewTokenDetails = useCallback(() => {
    onViewNodeDetails?.(data);
    setModalVisible(false);
  }, [onViewNodeDetails, data]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const isCurrent =
    tokenId === data.tokenId.toString() && collectionId === data.collectionId.toString();

  return (
    <>
      <ViewContainer
        isFirst={isFirst}
        isSelected={isSelected}
        isParentSelected={isParentSelected}
        onClick={onClick}
        onMouseEnter={showMenu}
        onMouseLeave={hideMenu}
      >
        <NftInfo>
          <Arrow
            isFirst={isFirst}
            level={level}
            isOpened={isOpened}
            onClick={arrowClicked}
          >
            {!!children && (
              <Icon size={16} name="triangle" color="var(--color-primary-500)" />
            )}
          </Arrow>
          <Picture
            alt={`T-${data.tokenId} C-${data.collectionId}`}
            src={
              // @ts-ignore
              (typeof data.image === 'string' ? data.image : data.image?.fullUrl) ||
              undefined
            }
          />
          <TokenTitle
            token={data}
            isCollectionLoading={isCollectionLoading}
            prefix={collection?.tokenPrefix || ''}
          />
        </NftInfo>
        <Actions>
          {deviceSize !== DeviceSize.sm && (
            <ActionButtons
              className="action-buttons"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {menuVisible && data.isCurrentAccountOwner && !isMobileView && (
                <ActionsMenuWrapper>
                  <TooltipWrapper
                    align={{
                      vertical: 'top',
                      horizontal: 'middle',
                      appearance: 'vertical',
                    }}
                    message="Open additional menu"
                  >
                    <Dropdown
                      placement="right"
                      dropdownRender={() => (
                        <DropdownMenu>{tokenMenuActions}</DropdownMenu>
                      )}
                    >
                      <Icon
                        size={32}
                        file={MeatBallIcon}
                        color="var(--color-secondary-400)"
                      />
                    </Dropdown>
                  </TooltipWrapper>
                </ActionsMenuWrapper>
              )}
              {!isCurrent && !isMobileView && (
                <div onClick={viewTokenDetails}>
                  <TooltipWrapper
                    align={{
                      vertical: 'top',
                      horizontal: 'middle',
                      appearance: 'vertical',
                    }}
                    message="Go to the token page"
                  >
                    <Icon
                      size={32}
                      file={SquareIcon}
                      color="var(--color-secondary-400)"
                    />
                  </TooltipWrapper>
                </div>
              )}
            </ActionButtons>
          )}
          {isCurrent && (
            <PinIcon className="pin-icon">
              <TooltipWrapper
                align={{ vertical: 'top', horizontal: 'middle', appearance: 'vertical' }}
                message="Current token page"
              >
                <Icon size={32} file={Pin} />
              </TooltipWrapper>
            </PinIcon>
          )}
          {isMobileView && <Icon size={32} file={MeatBallIcon} />}
        </Actions>
        <hr />
      </ViewContainer>
      <MobileModalActions isVisible={modalVisible} onClose={closeModal}>
        <ViewTokenAction onClick={viewTokenDetails}>
          Go to the token page
          <IconWrapper>
            <Icon name="arrow-up-right" size={16} color="var(--color-primary-500)" />
          </IconWrapper>
        </ViewTokenAction>
        {tokenMenuActions}
      </MobileModalActions>
      {isOpened ? children : null}
    </>
  );
};

const ViewContainer = styled.div<{
  isFirst: boolean | undefined;
  isSelected: boolean | undefined;
  isParentSelected: boolean | undefined;
}>`
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border: 1px solid
    ${({ isSelected }) => (isSelected ? 'var(--color-primary-200)' : 'transparent')};
  hr {
    position: absolute;
    border-top: 1px dashed var(--color-grey-300);
    border-left: none;
    bottom: -3px;
    width: 100%;
    z-index: 1;
  }
  .picture {
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-left: var(--gap);
    margin-right: calc(var(--gap) / 2);
    img {
      border-radius: 4px;
      max-width: 100%;
      max-height: 100%;
      object-fit: fill;
    }
  }
  &:hover {
    border: 1px solid var(--color-primary-400);
    z-index: 2;
    hr {
      display: none;
    }
    .action-buttons {
      display: flex;
    }
  }
  background-color: ${({ isSelected, isParentSelected }) =>
    isSelected
      ? 'var(--color-primary-200)'
      : isParentSelected
      ? 'var(--color-primary-100)'
      : 'none'} !important;
`;

const NftInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
  margin-right: 24px;
`;

const ActionButtons = styled.div`
  gap: 4px;
  display: none;
  align-items: center;
  svg:hover {
    fill: var(--color-primary-500);
  }
`;

const PinIcon = styled.div``;

const Arrow = styled.div<{
  isOpened: boolean | undefined;
  isFirst: boolean | undefined;
  level: number;
}>`
  cursor: pointer;
  display: inline-block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: 0.2s;
  transform: ${({ isOpened }) => !isOpened && 'rotate(180deg)'};
  margin-left: ${({ isFirst, level }) => (isFirst ? 24 : 24 + 16 * level)}px;
  width: 16px;
`;

const ActionsMenuWrapper = styled.div`
  display: flex;
  position: relative;

  div[class*='DropdownMenuButtonWrapper'] {
    & > button {
      padding: 4px;
      background-color: var(--color-additional-dark);
      border: 2px solid #ffffff;
      border-radius: 4px;
      color: var(--color-additional-light);
      height: 32px;
      &:hover {
        background-color: var(--color-additional-dark);
      }
    }
  }
  div[class*='DropdownMenuDropdown'] {
    position: absolute;
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

const ViewTokenAction = styled(TransferMenuItem)`
  svg {
    transform: rotateX(180deg);
  }
`;

const IconWrapper = styled.div`
  && {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    transform: rotate(-90deg);

    path {
      stroke: currentColor;
    }
  }
`;

export default NodeView;

const TokenTitle: FC<{
  isCollectionLoading: boolean;
  prefix: string;
  token: INestingToken;
}> = ({ isCollectionLoading, prefix, token }) => {
  if (isCollectionLoading) {
    return <Loader size="large" />;
  }
  return (
    <TitleContainer>
      <Name>
        {prefix} #{token.tokenId}
      </Name>
      {token.nestingChildTokens?.length > 0 && (
        <NestedCount>
          {token.nestingChildTokens.length} item
          {token.nestingChildTokens.length > 1 && 's'}
        </NestedCount>
      )}
    </TitleContainer>
  );
};

const TitleContainer = styled.div`
  cursor: pointer;
  display: inline-block;
`;

const Name = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: var(--color-additional-dark);
`;

const NestedCount = styled.p`
  font-size: 12px;
  line-height: 18px;
  color: var(--color-blue-grey-500);
`;
