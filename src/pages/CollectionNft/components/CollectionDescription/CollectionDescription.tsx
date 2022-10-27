import { useState, VFC } from 'react';
import styled from 'styled-components';
import { addSeconds, format } from 'date-fns';
import { Avatar, Loader } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import { existValue, getTokenIpfsUriByImagePath } from '@app/utils';
import { AccountLinkComponent, ExternalLink } from '@app/components';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import { getSponsorShip } from '@app/pages/CollectionPage/utils';
import { maxTokenLimit } from '@app/pages/constants/token';

const CollectionDescriptionComponent: VFC<{ collectionId: string }> = ({
  collectionId,
}) => {
  const { currentChain } = useApi();
  const { collection, collectionLoading } = useCollectionContext() || {};
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
    <CollectionVerticalCard>
      {collectionLoading ? (
        <Loader />
      ) : (
        <>
          <Row>
            <Avatar src={getTokenIpfsUriByImagePath(collection_cover)} type="circle" />
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
          {description && (
            <Row>
              <Description>{description}</Description>
            </Row>
          )}
          <Row>
            <span>
              <ExternalLink
                href={`${currentChain.uniquescanAddress}/collections/${collectionId}`}
              >
                View collection on Scan
              </ExternalLink>
            </span>
          </Row>
        </>
      )}
    </CollectionVerticalCard>
  );
};

const CollectionVerticalCard = styled.div`
  display: flex;
  flex-direction: column;
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
  width: 100%;
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
  .unique-collection-card {
    overflow: hidden;
    word-break: break-all;
  }
`;
