import { memo, useMemo, VFC } from 'react';
import styled from 'styled-components';
import {
  Button,
  Dropdown,
  Heading,
  Icon,
  Link,
  SelectOptionProps,
  Text,
} from '@unique-nft/ui-kit';

import { TNFTModalType } from '@app/pages/NFTDetails/Modals/types';
import { BurnBtn, IdentityIcon, TransferBtn } from '@app/components';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

interface NFTDetailsHeaderProps {
  title?: string;
  collectionId?: number;
  collectionName?: string;
  ownerAddress?: string;
  isCurrentAccountOwner?: boolean;
  className?: string;
  onShowModal(modal: TNFTModalType): void;
}

interface MenuOptionItem extends SelectOptionProps {
  color?: string;
  disabled?: boolean;
  id: TNFTModalType;
}

const HeaderTopContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--prop-gap);
`;

const HeaderBottomContainer = styled.div`
  .collection-heading {
    margin-bottom: var(--prop-gap);
  }
`;

const HeaderContent = styled.div`
  min-width: 0;

  .collection-link {
    display: flex;
    margin-bottom: calc(var(--prop-gap) / 2);

    &-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const MenuOptionContainer = styled.div<{ color?: string }>`
  margin: 0 calc(var(--prop-gap) / (-2));

  &:not(:hover) {
    color: ${(p) => p.color};
  }

  .unique-button {
    padding: 0 calc(var(--prop-gap) / 2);

    &:not([disabled]) {
      color: inherit;
    }

    & > .icon {
      pointer-events: none;
    }
  }
`;

const TextOwner = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: calc(var(--prop-gap) * 1.5);
  color: var(--color-grey-500);
`;

const Address = styled.span`
  display: flex;
  align-items: center;
  margin-left: calc(var(--prop-gap) / 2);
  color: var(--color-primary-500);

  .address-account-image {
    margin-right: calc(var(--prop-gap) / 2);
  }
`;

const MenuOption = (
  option: SelectOptionProps & { color?: string; disabled?: boolean },
) => {
  return (
    <MenuOptionContainer color={option.color}>
      {option.disabled ? (
        <BurnBtn
          disabled={option.disabled}
          iconLeft={{
            color: 'currentColor',
            name: (option.icon as string) ?? '',
            size: 16,
          }}
          role="ghost"
          title={option.title as string}
          wide={true}
        />
      ) : (
        <Button
          disabled={option.disabled}
          iconLeft={{
            color: 'currentColor',
            name: (option.icon as string) ?? '',
            size: 16,
          }}
          role="ghost"
          title={option.title as string}
          wide={true}
        />
      )}
    </MenuOptionContainer>
  );
};

const NFTDetailsHeaderComponent: VFC<NFTDetailsHeaderProps> = ({
  title = '',
  collectionName = '',
  collectionId,
  ownerAddress,
  isCurrentAccountOwner,
  className,
  onShowModal,
}) => {
  const { currentChain } = useApi();
  const size = useDeviceSize();

  const options = useMemo(() => {
    const items: SelectOptionProps[] = [
      {
        icon: 'shared',
        id: 'share',
        title: 'Share',
      },
    ];

    if (isCurrentAccountOwner) {
      items.push({
        color: 'var(--color-coral-500)',
        icon: 'burn',
        id: 'burn',
        title: 'Burn NFT',
      });
    }

    return items;
  }, [isCurrentAccountOwner]);

  return (
    <>
      <HeaderTopContainer className={className}>
        <HeaderContent>
          <Link
            target="_blank"
            rel="noreferrer"
            color="primary"
            href={`${currentChain.uniquescanAddress}/collections/${collectionId}`}
            className="collection-link"
          >
            <Text className="collection-link-text" color="primary-500" weight="light">
              {`${collectionName} [id ${collectionId}]`}
            </Text>
            <div>
              <Icon color="var(--color-primary-500)" size={16} name="arrow-up-right" />
            </div>
          </Link>
        </HeaderContent>
        <Dropdown
          placement="right"
          options={options}
          optionRender={(opt) => (
            <MenuOption
              {...(opt as MenuOptionItem)}
              disabled={opt.id === 'burn' && !currentChain.burnEnabled}
            />
          )}
          onChange={(opt) => {
            if (opt.id === 'burn' && !currentChain.burnEnabled) {
              return;
            }
            onShowModal((opt as MenuOptionItem).id);
          }}
        >
          <Icon
            size={40}
            name="rounded-rectangle-more"
            color="var(--color-secondary-400)"
          />
        </Dropdown>
      </HeaderTopContainer>
      <HeaderBottomContainer>
        <Heading size={size === DeviceSize.xs ? '2' : '1'} className="collection-heading">
          {title}
        </Heading>
        <TextOwner>
          {isCurrentAccountOwner ? (
            'You own it'
          ) : (
            <>
              Owned by
              <Address>
                <IdentityIcon
                  address={ownerAddress || ''}
                  className="address-account-image"
                />
                {ownerAddress}
              </Address>
            </>
          )}
        </TextOwner>
        {isCurrentAccountOwner && (
          <TransferBtn
            wide={size <= DeviceSize.sm}
            className="transfer-btn"
            title="Transfer"
            role="primary"
            onClick={() => {
              logUserEvent(UserEvents.TRANSFER_NFT);
              onShowModal('transfer');
            }}
          />
        )}
      </HeaderBottomContainer>
    </>
  );
};

export const NFTDetailsHeader = memo(styled(NFTDetailsHeaderComponent)``);
