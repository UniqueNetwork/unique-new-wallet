import { memo, useMemo, VFC } from 'react';
import styled from 'styled-components';
import {
  Button,
  Dropdown,
  Heading,
  Text,
  SelectOptionProps,
  Icon,
} from '@unique-nft/ui-kit';

interface NFTDetailsHeaderProps {
  title?: string;
  ownerAddress?: string;
  isCurrentAccountOwner?: boolean;
  className?: string;
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

const NFTDetailsHeaderComponent: VFC<NFTDetailsHeaderProps> = ({
  title = '',
  ownerAddress,
  isCurrentAccountOwner,
  className,
}) => {
  const options = useMemo(() => {
    const items: SelectOptionProps[] = [
      {
        id: 1,
        title: 'Share',
        icon: {
          name: 'shared',
          size: 12,
        },
      },
    ];

    if (isCurrentAccountOwner) {
      items.push({
        id: 2,
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
          <Button className="transfer-btn" title="Transfer" role="outlined" />
        )}
      </HeaderContent>
      <Dropdown
        placement="right"
        options={options}
        optionRender={(opt) => <MenuOption {...opt} />}
      >
        <Icon size={40} name="rounded-rectangle-more" />
      </Dropdown>
    </HeaderContainer>
  );
};

export const NFTDetailsHeader = memo(styled(NFTDetailsHeaderComponent)`
  .transfer-btn {
    margin-top: calc(var(--prop-gap) * 1.5);
  }
`);
