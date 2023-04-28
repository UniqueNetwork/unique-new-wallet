import { memo, ReactNode, VFC } from 'react';
import styled from 'styled-components';

import { Button, Heading } from '@app/components';
import { TTokenModalType } from '@app/pages/TokenDetails/Modals/types';
import { ButtonGroup } from '@app/pages/components/FormComponents';
import { Card } from '@app/pages/components/Card';

interface TokenDetailsHeaderProps {
  title?: string;
  tokenId?: string;
  collectionId?: number;
  collectionName?: string;
  collectionCoverUrl?: string;
  ownerAddress?: string;
  className?: string;
  buttons: ReactNode;
  onShowModal(modal: TTokenModalType): void;
  owner: ReactNode;
  canBurn: boolean;
  burnModal: TTokenModalType;
}

const HeaderContainerInfo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--prop-gap);

  .danger {
    color: var(--color-coral-500);

    &:hover {
      background-color: var(--color-coral-100);
      color: var(--color-coral-500);
    }
  }
`;

const HeaderContent = styled.div`
  min-width: 0;

  .header-link {
    margin-bottom: calc(var(--prop-gap) / 2);
    font-size: 1rem;

    h5 {
      font-size: 16px;
      margin-bottom: 0;
    }
    span {
      color: var(--color-additional-dark);
      font-size: 12px;
      font-weight: 400;
    }
    img + div {
      padding-left: calc(var(--prop-gap) / 2);
    }
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

const TitleWrapper = styled.div`
  display: flex;
  height: 48px;
  margin-bottom: var(--prop-gap);
  gap: calc(var(--prop-gap) / 2);
  button {
    padding: 0 !important;
  }
`;

const TokenDetailsHeaderComponent: VFC<TokenDetailsHeaderProps> = ({
  title = '',
  collectionName = '',
  collectionId,
  collectionCoverUrl,
  className,
  buttons,
  canBurn,
  burnModal,
  onShowModal,
  owner,
}) => {
  return (
    <div className={className}>
      <HeaderContainerInfo>
        <HeaderContent>
          <div className="header-link">
            <Card
              title={collectionName}
              description={`ID ${collectionId}`}
              picture={collectionCoverUrl || undefined}
              size={40}
              color="var(--color-primary-500)"
            />
          </div>
          <TitleWrapper>
            <Heading className="collection-heading">{title}</Heading>

            <Button
              role="ghost"
              iconLeft={{
                name: 'shared',
                size: 24,
              }}
              title={undefined}
              onClick={() => onShowModal('share')}
            />
          </TitleWrapper>
          <TextOwner>{owner}</TextOwner>
        </HeaderContent>
        {canBurn && (
          <Button
            className="danger"
            iconRight={{
              color: 'currentColor',
              name: 'burn',
              size: 16,
            }}
            role="ghost"
            title="Burn token"
            onClick={() => onShowModal(burnModal)}
          />
        )}
      </HeaderContainerInfo>

      {buttons && (
        <ButtonGroupStyled stack gap={8}>
          {buttons}
        </ButtonGroupStyled>
      )}
    </div>
  );
};

export const TokenDetailsHeader = memo(styled(TokenDetailsHeaderComponent)``);
