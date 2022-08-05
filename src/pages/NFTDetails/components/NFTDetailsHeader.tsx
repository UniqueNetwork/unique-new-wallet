import { memo, useMemo, VFC } from 'react';
import styled from 'styled-components';
import {
  Button,
  Dropdown,
  Heading,
  Icon,
  SelectOptionProps,
  Text,
} from '@unique-nft/ui-kit';

import { TNFTModalType } from '@app/pages/NFTDetails/Modals/types';
import { BurnBtn, TransferBtn } from '@app/components';
import { useApi } from '@app/hooks';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

interface NFTDetailsHeaderProps {
  title?: string;
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

const HeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const HeaderContent = styled.div``;

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

const TextOwner = styled(Text).attrs({
  appearance: 'block',
  color: 'grey-500',
  size: 's',
  weight: 'light',
})`
  margin-bottom: var(--prop-gap);
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
  ownerAddress,
  isCurrentAccountOwner,
  className,
  onShowModal,
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
    <HeaderContainer className={className}>
      <HeaderContent>
        <Heading>{title}</Heading>
        <TextOwner>
          {isCurrentAccountOwner ? (
            'You own it'
          ) : (
            <>
              Owned by{' '}
              <span style={{ color: 'var(--color-primary-500' }}>{ownerAddress}</span>
            </>
          )}
        </TextOwner>
        {isCurrentAccountOwner && (
          <TransferBtn
            className="transfer-btn"
            title="Transfer"
            role="outlined"
            onClick={() => {
              logUserEvent(UserEvents.TRANSFER_NFT);
              onShowModal('transfer');
            }}
          />
        )}
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
        <Icon size={40} name="rounded-rectangle-more" />
      </Dropdown>
    </HeaderContainer>
  );
};

export const NFTDetailsHeader = memo(styled(NFTDetailsHeaderComponent)``);
