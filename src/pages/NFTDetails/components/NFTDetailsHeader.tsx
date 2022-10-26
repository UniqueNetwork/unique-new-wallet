import { memo, ReactNode, useMemo, VFC } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Heading, Icon, SelectOptionProps } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import { BurnBtn, ExternalLink } from '@app/components';
import { TNFTModalType } from '@app/pages/NFTDetails/Modals/types';
import AccountCard from '@app/pages/Accounts/components/AccountCard';

interface NFTDetailsHeaderProps {
  title?: string;
  collectionId?: number;
  collectionName?: string;
  ownerAddress?: string;
  isCurrentAccountOwner?: boolean;
  className?: string;
  buttons: ReactNode;
  onShowModal(modal: TNFTModalType): void;
}

interface MenuOptionItem extends SelectOptionProps {
  color?: string;
  disabled?: boolean;
  id: TNFTModalType;
}

const HeaderContainerInfo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--prop-gap);
`;

const HeaderContent = styled.div`
  min-width: 0;

  .header-link {
    margin-bottom: calc(var(--prop-gap) / 2);
    font-size: 1rem;
  }

  .collection-heading {
    margin-bottom: var(--prop-gap);
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
  gap: calc(var(--prop-gap) / 2);
  margin-bottom: calc(var(--prop-gap) * 1.5);
  color: var(--color-grey-500);
  font-size: 1rem;
  white-space: nowrap;
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
  buttons,
}) => {
  const { currentChain } = useApi();

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
    <div className={className}>
      <HeaderContainerInfo>
        <HeaderContent>
          <div className="header-link">
            <ExternalLink
              href={`${currentChain.uniquescanAddress}/collections/${collectionId}`}
            >
              {`${collectionName} [id ${collectionId}]`}
            </ExternalLink>
          </div>
          <Heading className="collection-heading">{title}</Heading>
          <TextOwner>
            {isCurrentAccountOwner ? (
              'You own it'
            ) : (
              <>
                Owned by
                <AccountCard
                  accountAddress={ownerAddress || ''}
                  canCopy={false}
                  scanLink={`${currentChain.uniquescanAddress}/account/${ownerAddress}`}
                />
              </>
            )}
          </TextOwner>
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
      </HeaderContainerInfo>
      {buttons && <div className="nft-details-buttons">{buttons}</div>}
    </div>
  );
};

export const NFTDetailsHeader = memo(styled(NFTDetailsHeaderComponent)``);
