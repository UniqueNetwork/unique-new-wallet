import { memo, ReactNode, VFC } from 'react';
import styled from 'styled-components';

import { SelectOptionProps } from '@app/components/types';
import { useApi } from '@app/hooks';
import { BurnBtn, Dropdown, ExternalLink, Button, Heading } from '@app/components';
import { TTokenModalType } from '@app/pages/NFTDetails/Modals/types';
import { ButtonGroup } from '@app/pages/components/FormComponents';

interface NFTDetailsHeaderProps {
  title?: string;
  tokenId?: string;
  collectionId?: number;
  collectionName?: string;
  ownerAddress?: string;
  className?: string;
  buttons: ReactNode;
  menuButtons: SelectOptionProps[];
  onShowModal(modal: TTokenModalType): void;
  owner: ReactNode;
}

interface MenuOptionItem extends SelectOptionProps {
  disabled?: boolean;
  id: TTokenModalType;
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
  color: var(--color-grey-500);
  font-size: 1rem;
  white-space: nowrap;

  &:not(:last-child) {
    margin-bottom: calc(var(--prop-gap) * 1.5);
  }
`;

const ButtonGroupStyled = styled(ButtonGroup)`
  margin-top: calc(var(--prop-gap) * 1.5);
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
  className,
  onShowModal,
  buttons,
  menuButtons,
  owner,
}) => {
  const { currentChain } = useApi();

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
          <TextOwner>{owner}</TextOwner>
        </HeaderContent>
        <Dropdown
          placement="right"
          options={menuButtons}
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
                `${currentChain.uniquescanAddress}/tokens/${collectionId}/${tokenId}`,
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

      {buttons && (
        <ButtonGroupStyled stack gap={8}>
          {buttons}
        </ButtonGroupStyled>
      )}
    </div>
  );
};

export const NFTDetailsHeader = memo(styled(NFTDetailsHeaderComponent)``);
