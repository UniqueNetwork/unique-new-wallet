import styled from 'styled-components';
import { CollectionNestingPermissionsDto, CollectionSponsorship } from '@unique-nft/sdk';
import { addSeconds, format } from 'date-fns';
import { useMemo } from 'react';

import { Collection } from '@app/api/graphQL/types';
import { Link, Loader, Typography } from '@app/components';
import { maxTokenLimit } from '@app/pages/constants';
import { useApi } from '@app/hooks';
import { shortAddress } from '@app/utils';

interface CollectionStatsProps {
  collection: Collection;
  tokensLimit: number;
  tokensLeft: number | string;
  lastTokenId: number;
  nestingPermissions: CollectionNestingPermissionsDto | undefined;
  sponsorship: CollectionSponsorship | undefined;
  isFetching: boolean;
}

export const CollectionStats = ({
  collection,
  isFetching,
  tokensLimit,
  tokensLeft,
  lastTokenId,
  nestingPermissions,
  sponsorship,
}: CollectionStatsProps) => {
  const { currentChain } = useApi();
  const noLimits = maxTokenLimit === tokensLimit;
  const nestingValue = useMemo(() => {
    if (!!nestingPermissions?.collectionAdmin && !!nestingPermissions?.tokenOwner) {
      return 'Allowed';
    }
    if (nestingPermissions?.collectionAdmin) {
      return 'Administrators only';
    }
    if (nestingPermissions?.tokenOwner) {
      return 'Token owners only';
    }
    return 'Disallowed';
  }, [nestingPermissions]);

  if (isFetching) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }
  console.log('tokensLimit', tokensLimit);
  return (
    <CollectionStatisticsBlockWrapper>
      <div>
        <Typography size="l" weight="bold">
          {noLimits || tokensLimit === undefined ? 'Unlimited' : tokensLimit}
        </Typography>
        <Typography size="m" color="grey-600">
          token limit
        </Typography>
      </div>
      <div>
        <Typography size="l" weight="bold">
          {lastTokenId}
        </Typography>
        <Typography size="m" color="grey-600">
          tokens exist
        </Typography>
      </div>
      <div>
        <Typography size="l" weight="bold">
          {noLimits ? 'Unlimited' : tokensLeft}
        </Typography>
        <Typography size="m" color="grey-600">
          tokens left to create
        </Typography>
      </div>
      <div>
        <Typography size="l" weight="bold">
          {collection.date_of_creation
            ? getDateFormat(collection.date_of_creation * 1000)
            : 'unknown'}
        </Typography>
        <Typography size="m" color="grey-600">
          creation date
        </Typography>
      </div>
      <div>
        <Typography size="l" weight="bold">
          {nestingValue}
        </Typography>
        <Typography size="m" color="grey-600">
          nesting permission
        </Typography>
      </div>
      {sponsorship?.isConfirmed && (
        <div>
          <Link href={`${currentChain.uniquescanAddress}/account/${sponsorship.address}`}>
            <Typography size="l" weight="bold" color="primary-500">
              {shortAddress(sponsorship.address)}
            </Typography>
          </Link>
          <Typography size="m" color="grey-600">
            collection sponsor
          </Typography>
        </div>
      )}
    </CollectionStatisticsBlockWrapper>
  );
};

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  min-height: 60px;
  width: 100%;
`;

const CollectionStatisticsBlockWrapper = styled.div`
  display: flex;
  margin-top: calc(var(--gap) / 2);
  margin-right: calc(var(--gap) / 2);
  height: 100%;
  overflow: hidden;
  & > div {
    display: flex;
    flex-direction: column;
    padding-right: calc(var(--gap) * 1.5);
    margin-right: calc(var(--gap) * 1.5);
    border-right: 1px solid var(--color-blue-grey-200);
    & > h3.unique-font-heading {
      margin-bottom: calc(var(--gap) / 4);
    }
    span.color-grey-600 {
      color: var(--color-grey-600);
    }
  }
  @media (max-width: 1024px) {
    margin-right: 0;
    & > div {
      padding-right: calc(var(--gap) * 1);
      margin-right: calc(var(--gap) * 1);
    }
  }
  @media (max-width: 576px) {
    flex-direction: column;
    width: 100%;
    gap: calc(var(--gap) / 4);
    & > div {
      flex-direction: row-reverse;
      justify-content: flex-end;
      gap: calc(var(--gap) / 2);
      align-items: baseline;
      border-right: none;
      padding: 0;
      margin: 0;
      span:last-child {
        flex: 1;
      }
    }
  }
  & > div:last-child {
    border: none;
    padding-right: 0;
    margin-right: 0;
  }
`;

const getDateFormat = (timestamp: number) => {
  return `${format(addSeconds(new Date(0), timestamp), 'MMMM, d, yyyy')}`;
};
