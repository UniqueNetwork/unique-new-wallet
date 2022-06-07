import { VFC } from 'react';
import classNames from 'classnames';
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
  options: SelectOptionProps[];
  className?: string;
}

const HeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuOption = (option: SelectOptionProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon
        size={16}
        color={(option.color as string) ?? ''}
        name={(option.icon as any).name ?? ''}
      />
      <Text color={(option.color as string) ?? ''}>{option.title as string}</Text>
    </div>
  );
};

const NFTDetailsHeaderComponent: VFC<NFTDetailsHeaderProps> = ({
  options,
  className,
}) => {
  return (
    <HeaderContainer className={classNames(className)}>
      <HeaderContent>
        <Heading size="1">Chel #8012</Heading>
        <Text size="s" weight="light" color="grey-500">
          You own it
        </Text>
        <Button className="transfer-btn" title="Transfer" role="outlined" />
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

export const NFTDetailsHeader = styled(NFTDetailsHeaderComponent)`
  .transfer-btn {
    margin-top: calc(var(--prop-gap) * 1.5);
  }
`;
