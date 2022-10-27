import { memo, ReactNode, useMemo, VFC } from 'react';
import styled from 'styled-components';
import { Button, Heading, SelectOptionProps } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import { BurnBtn, Dropdown, ExternalLink } from '@app/components';
import { TNFTModalType } from '@app/pages/NFTDetails/Modals/types';
import AccountCard from '@app/pages/Accounts/components/AccountCard';

interface NFTDetailsHeaderProps {
  title?: string;
  tokenId?: string;
  collectionId?: number;
  collectionName?: string;
  ownerAddress?: string;
  isCurrentAccountOwner?: boolean;
  className?: string;
  buttons: ReactNode;

  onShowModal(modal: TNFTModalType): void;
}

interface MenuOptionItem extends SelectOptionProps {
  disabled?: boolean;
  id: TNFTModalType;
}

const HeaderContainerInfo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--prop-gap);

  .dropdown-options {
    .dropdown-option {
      position: relative;
      margin: 0 !important;
      padding: 0;

      &:not(:first-child) {
        margin-top: calc(var(--prop-gap) / 2) !important;

        &:before {
          border-top: 1px dashed var(--color-grey-300);
          position: absolute;
          top: calc(var(--prop-gap) / (-4));
          left: 0;
          width: 100%;
          height: 0;
          content: '';
          pointer-events: none;
        }
      }

      &-primary {
        color: var(--color-primary-500);

        &:hover {
          background-color: var(--color-primary-100);
          color: var(--color-primary-500);
        }
      }

      &-danger {
        color: var(--color-coral-500);

        &:hover {
          background-color: var(--color-coral-100);
          color: var(--color-coral-500);
        }
      }

      &:active {
        color: inherit;
      }
    }

    .unique-button {
      box-sizing: border-box;
      border-radius: 0;
      justify-content: flex-start;
      width: 100%;
      padding: calc(var(--prop-gap) / 2);
      background: 0 none;
      color: inherit;
    }
  }
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
  const ButtonElement = option.disabled ? BurnBtn : Button;

  return (
    <ButtonElement
      disabled={option.disabled}
      iconRight={{
        color: 'currentColor',
        name: (option.icon as string) ?? '',
        size: 16,
      }}
      role="ghost"
      title={option.title as string}
      wide={true}
    />
  );
};

const NFTDetailsHeaderComponent: VFC<NFTDetailsHeaderProps> = ({
  title = '',
  tokenId,
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
        type: 'primary',
      },
      {
        icon: 'arrow-up-right',
        id: 'scan',
        title: 'View NFT on UniqueScan',
        type: 'primary',
      },
    ];

    if (isCurrentAccountOwner) {
      items.push({
        icon: 'burn',
        id: 'burn',
        title: 'Burn token',
        type: 'danger',
      });
    }

    return items;
  }, [isCurrentAccountOwner]);

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener, noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

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
            } else if (opt.id === 'scan') {
              openInNewTab(
                `${currentChain.uniquescanAddress}/nfts/${collectionId}/${tokenId}`,
              );
            }

            onShowModal((opt as MenuOptionItem).id);
          }}
        >
          <Button
            className="unique-button-icon"
            iconLeft={{
              color: 'currentColor',
              name: 'more-horiz',
              size: 24,
            }}
            title=""
          />
        </Dropdown>
      </HeaderContainerInfo>
      {buttons && <div className="nft-details-buttons">{buttons}</div>}
    </div>
  );
};

export const NFTDetailsHeader = memo(styled(NFTDetailsHeaderComponent)``);
