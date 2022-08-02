import { memo, ReactNode, useMemo, VFC } from 'react';
import styled from 'styled-components';
import { Dropdown, Heading, Text, SelectOptionProps, Icon } from '@unique-nft/ui-kit';

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
  id: TNFTModalType;
}

const HeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const MenuOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--prop-gap) * 0.5);
`;

const MenuOption = (option: SelectOptionProps) => {
  return (
    <MenuOptionContainer>
      <Icon
        size={16}
        color={(option.color as string) ?? ''}
        name={(option.icon as any).name ?? ''}
      />
      <Text color={(option.color as string) ?? ''}>{option.title as string}</Text>
    </MenuOptionContainer>
  );
};

const MenuBtnOption = (option: SelectOptionProps & { children: ReactNode }) => {
  return (
    <MenuOptionContainer>
      <Icon
        size={16}
        color={(option.color as string) ?? ''}
        name={(option.icon as any).name ?? ''}
      />
      {option.children}
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
        id: 'share',
        title: 'Share',
        icon: {
          name: 'shared',
          size: 12,
        },
      },
    ];

    if (isCurrentAccountOwner) {
      items.push({
        id: 'burn',
        title: 'Burn NFT',
        color: 'var(--color-coral-500)',
        icon: {
          name: 'burn',
          size: 12,
        },
      });
    }

    return items;
  }, [isCurrentAccountOwner]);

  return (
    <HeaderContainer className={className}>
      <HeaderContent>
        <Heading size="1">{title}</Heading>
        <Text size="s" weight="light" color="grey-500">
          {isCurrentAccountOwner ? (
            'You own it'
          ) : (
            <>
              Owned by{' '}
              <Text size="s" weight="light" color="primary-500">
                {ownerAddress}
              </Text>
            </>
          )}
        </Text>
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
        optionRender={(opt) => {
          if (opt.id === 'burn') {
            return (
              <BurnButtonWrapper disabled={!currentChain.burnEnabled}>
                <MenuBtnOption {...opt}>
                  <BurnBtn title={opt.title as string} role="ghost" />
                </MenuBtnOption>
              </BurnButtonWrapper>
            );
          }
          return <MenuOption {...(opt as MenuOptionItem)} />;
        }}
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

const BurnButtonWrapper = styled.div<{ disabled: boolean }>`
  svg {
    fill: ${(props) =>
      props.disabled ? 'var(--color-blue-grey-300)' : 'var(--color-coral-500)'};
  }

  .unique-button {
    background: none;
    padding: 0;
    color: ${(props) =>
      props.disabled ? 'var(--color-blue-grey-300)' : 'var(--color-coral-500)'}}
  }
`;

export const NFTDetailsHeader = memo(styled(NFTDetailsHeaderComponent)`
  .transfer-btn {
    margin-top: calc(var(--prop-gap) * 1.5);
  }
`);
