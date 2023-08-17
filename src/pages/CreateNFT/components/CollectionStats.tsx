import styled from 'styled-components';
import { CollectionNestingPermissionsDto, CollectionSponsorship } from '@unique-nft/sdk';
import { addSeconds, format } from 'date-fns';
import { useMemo } from 'react';

import { Collection } from '@app/api/graphQL/types';
import { Heading, Loader, Typography } from '@app/components';
import { maxTokenLimit } from '@app/pages/constants';
import { DeviceSize, useDeviceSize } from '@app/hooks';
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
  const deviceSize = useDeviceSize();
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

  return (
    <CollectionStatisticsBlockWrapper>
      <div>
        <Typography size="l" weight="bold">
          {noLimits ? 'Unlimited' : tokensLimit}
        </Typography>
        <Typography size="m" color="grey-600">
          Token limit
        </Typography>
      </div>
      <div>
        <Typography size="l" weight="bold">
          {lastTokenId}
        </Typography>
        <Typography size="m" color="grey-600">
          Tokens exist
        </Typography>
      </div>
      <div>
        <Typography size="l" weight="bold">
          {noLimits ? 'Unlimited' : tokensLeft}
        </Typography>
        <Typography size="m" color="grey-600">
          Tokens left to create
        </Typography>
      </div>
      <div>
        <Typography size="l" weight="bold">
          {getDateFormat(collection.date_of_creation * 1000)}
        </Typography>
        <Typography size="m" color="grey-600">
          Creation date
        </Typography>
      </div>
      <div>
        <Typography size="l" weight="bold">
          {nestingValue}
        </Typography>
        <Typography size="m" color="grey-600">
          Nesting permission
        </Typography>
      </div>
      {sponsorship?.isConfirmed && (
        <div>
          <Typography size="l" weight="bold">
            {deviceSize < DeviceSize.md
              ? shortAddress(sponsorship.address)
              : sponsorship.address}
          </Typography>
          <Typography size="m" color="grey-600">
            Collection sponsor
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
