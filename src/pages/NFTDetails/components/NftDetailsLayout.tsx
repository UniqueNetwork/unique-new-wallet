import { ReactNode, VFC } from 'react';
import classNames from 'classnames';
import { Loader } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { ErrorPage, PagePaper } from '@app/components';

interface NFTDetailsProps {
  className?: string;
  children: ReactNode;
  tokenExist?: boolean;
  isLoading?: boolean;
}

export const NftDetailsComponent: VFC<NFTDetailsProps> = ({
  className,
  children,
  tokenExist,
  isLoading,
}) => {
  const deviseSize = useDeviceSize();

  return (
    <>
      <PagePaper
        className={className}
        flexLayout="row"
        noPadding={deviseSize <= DeviceSize.md}
      >
        {!isLoading && !tokenExist ? (
          <ErrorPage />
        ) : (
          <div
            className={classNames('nft-page', {
              loading: isLoading,
            })}
          >
            {isLoading ? (
              <div className="nft-page__loader">
                <Loader size="middle" />
              </div>
            ) : (
              children
            )}
          </div>
        )}
      </PagePaper>
    </>
  );
};

export const NftDetailsLayout = styled(NftDetailsComponent)`
  .nft-page {
    width: 100%;

    &.loading {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
  }
`;
