import React, { FC, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { Dropdown, Icon, Loader } from '@unique-nft/ui-kit';

import Pin from 'static/icons/pin.svg';
import MeatBallIcon from 'static/icons/meatball.svg';
import SquareIcon from 'static/icons/square.svg';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { Image, TooltipWrapper } from '@app/components';

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
      if (isMobileView) {
        return;
      }

      textClicked(event);
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

  const tokenMenuActions = useMemo(
    () =>
      data.isCurrentAccountOwner ? (
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
      ) : null,
    [onTransfer, onUnnest],
  );

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
        isMobile={isMobileView}
        onClick={onClick}
        onMouseEnter={showMenu}
        onMouseLeave={hideMenu}
      >
        <ViewContainerInner isParentSelected={isParentSelected} isSelected={isSelected}>
          <span className="tree-node-indent">
            {[...Array(level - 1)].fill(0).map((x, i) => {
              return (
                <span className="tree-node-indent-item" key={`${data.tokenId}-${i}`} />
              );
            })}
            {children ? (
              <span
                className={classNames(
                  'tree-node-indent-item',
                  'tree-node-indent-trigger',
                  { _opened: isOpened },
                )}
                role="button"
                onClick={arrowClicked}
              >
                <Icon size={16} name="triangle" color="currentColor" />
              </span>
            ) : (
              <span className="tree-node-indent-item" />
            )}
          </span>
          <NftInfo>
            <Image
              alt={`T-${data.tokenId} C-${data.collectionId}`}
              className="picture"
              image={
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
                {menuVisible && !isCurrent && !isMobileView && (
                  <span onClick={viewTokenDetails}>
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
                  </span>
                )}
              </ActionButtons>
            )}
            {isCurrent && (
              <PinIcon className="pin-icon">
                <TooltipWrapper
                  align={{
                    vertical: 'top',
                    horizontal: 'middle',
                    appearance: 'vertical',
                  }}
                  message="Current token page"
                >
                  <Icon size={32} file={Pin} />
                </TooltipWrapper>
              </PinIcon>
            )}
            {isMobileView && (
              <span onClick={() => setModalVisible(true)}>
                <Icon size={32} file={MeatBallIcon} />
              </span>
            )}
          </Actions>
        </ViewContainerInner>
      </ViewContainer>

      {isOpened ? children : null}

      <MobileModalActions isVisible={modalVisible} onClose={closeModal}>
        <ViewTokenAction onClick={viewTokenDetails}>
          Go to the token page
          <IconWrapper>
            <Icon name="arrow-up-right" size={16} color="var(--color-primary-500)" />
          </IconWrapper>
        </ViewTokenAction>
        {tokenMenuActions}
      </MobileModalActions>
    </>
  );
};

const ViewContainerInner = styled.div<{
  isSelected: boolean | undefined;
  isParentSelected: boolean | undefined;
}>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 58px;
  padding: calc(var(--prop-gap) / 2) var(--prop-gap);
  background-color: ${({ isSelected, isParentSelected }) =>
    isSelected
      ? 'var(--color-primary-200)'
      : isParentSelected
      ? 'var(--color-primary-100)'
      : 'none'} !important;
`;

const ViewContainer = styled.div<{ isFirst: boolean | undefined; isMobile: boolean }>`
  border-bottom: 1px dashed var(--color-grey-300);
  position: relative;
  cursor: ${(p) => !p.isMobile && 'pointer'};

  &:hover {
    &::before {
      border: 1px solid var(--color-primary-400);
      position: absolute;
      z-index: 1;
      top: -1px;
      bottom: -1px;
      left: 0;
      right: 0;
      content: '';
      pointer-events: none;
    }
  }

  .tree-node-indent {
    flex: 0 0 auto;
    white-space: nowrap;

    &-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      width: 40px;
      height: 40px;
      margin-right: 8px;

      &:empty {
        width: 48px;
        margin-right: 0;
        user-select: none;
      }
    }

    &-trigger {
      color: var(--color-blue-grey-400);
      cursor: pointer;
      transition: transform 0.15s linear;

      &:hover {
        color: var(--color-primary-400);
      }

      &._opened {
        transform: rotate(-180deg);
      }
    }
  }

  .picture {
    display: inline-block;
    width: 40px;
    height: 40px;
  }
`;

const NftInfo = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--prop-gap) / 2);
  padding-left: var(--prop-gap);
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg:hover {
    fill: var(--color-primary-500);
  }
`;

const PinIcon = styled.div``;

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
  display: inline-block;
  padding-left: calc(var(--prop-gap) / 2);
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
