import React, { useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { format, addSeconds } from 'date-fns';
import { Avatar, Loader } from '@unique-nft/ui-kit';

import { AccountLinkComponent, CollectionScanLink } from '@app/components';
import { PaddedBlock } from '@app/styles/styledVariables';
import noCollections from '@app/static/icons/no-collections.svg';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import { getSponsorShip } from '@app/pages/CollectionPage/utils';
import { existValue, getTokenIpfsUriByImagePath } from '@app/utils';
import { maxTokenLimit } from '@app/pages/constants/token';

interface CollectionDescriptionComponentProps {
  className?: string;
  collectionId: string;
}

const CollectionDescriptionComponent: VFC<CollectionDescriptionComponentProps> = ({
  className,
  collectionId,
}) => {
  const { collection, isCollectionFetching } = useCollectionContext() || {};
  const {
    description,
    token_prefix,
    token_limit,
    tokens_count,
    sponsorship = null,
    date_of_creation,
    collection_cover = null,
  } = collection || {};

  const sponsor = getSponsorShip(sponsorship);

  const [offsetHours] = useState(() => {
    const offsetMinutes = new Date().getTimezoneOffset() * -1;
    return offsetMinutes / 60;
  });

  return (
    <div className={classNames('collection-description', className)}>
      <CollectionVerticalCard>
        {isCollectionFetching ? (
          <Loader />
        ) : (
          <>
            <Row>
              <Avatar
                src={getTokenIpfsUriByImagePath(collection_cover) || noCollections}
                type="circle"
              />
              <Badge>ID: {collectionId}</Badge>
            </Row>
            <Row>
              <span>
                Items: <strong>{tokens_count}</strong>
              </span>
              <span>
                Symbol: <strong>{token_prefix}</strong>
              </span>
            </Row>
            {sponsor?.isConfirmed && (
              <Row>
                <span>
                  Sponsor: <AccountLinkComponent value={sponsor.value} />
                </span>
              </Row>
            )}
            {existValue(token_limit) && (
              <Row>
                <span>
                  Token limit:{' '}
                  <strong>
                    {token_limit === maxTokenLimit ? 'Unlimited' : token_limit}
                  </strong>
                </span>
              </Row>
            )}
            <Row>
              <span>
                Date of creation:{' '}
                <strong>
                  {date_of_creation
                    ? `${format(
                        addSeconds(new Date(0), date_of_creation),
                        'MMMM, d, yyyy, HH:mm:ss',
                      )} UTC ${offsetHours > 0 ? '+' : ''}${offsetHours}`
                    : 'Calculation in progress...'}
                </strong>
              </span>
            </Row>
            {description && <Description>{description}</Description>}
            <CollectionScanLink collectionId={collectionId} />
          </>
        )}
      </CollectionVerticalCard>
    </div>
  );
};

const CollectionVerticalCard = styled.div`
  display: flex;
  flex-direction: column;
  ${PaddedBlock};
  grid-row-gap: var(--prop-gap);

  strong {
    font-weight: normal;
    color: var(--color-secondary-500);
  }
`;

const Row = styled.div`
  display: flex;
  grid-column-gap: var(--prop-gap);
  align-items: center;
  color: var(--color-grey-500);
`;

const Description = styled.div`
  padding: var(--prop-gap) 0;
  border-top: 1px dashed var(--color-grey-300);
  border-bottom: 1px dashed var(--color-grey-300);
  color: var(--color-grey-500);
  word-break: break-all;
`;

export const Badge = styled.div`
  background: var(--color-grey-100);
  border-radius: 4px;
  font-family: var(--prop-font-family);
  font-size: 14px;
  line-height: 22px;
  color: var(--color-secondary-500);
  padding: calc(var(--prop-gap) / 4) calc(var(--prop-gap) / 2);
  height: 22px;
`;

export const CollectionDescription = styled(CollectionDescriptionComponent)`
  border-right: 1px solid var(--color-grey-300);

  .unique-collection-card {
    overflow: hidden;
    word-break: break-all;
  }
`;
