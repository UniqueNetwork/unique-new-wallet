import { ReactNode, VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { ErrorPage, PagePaper, Loader } from '@app/components';

interface TokenDetailsProps {
  className?: string;
  children: ReactNode;
  tokenExist?: boolean;
  isLoading?: boolean;
}

export const TokenDetailsComponent: VFC<TokenDetailsProps> = ({
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

export const TokenDetailsLayout = styled(TokenDetailsComponent)`
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
