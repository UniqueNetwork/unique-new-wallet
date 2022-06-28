import classNames from 'classnames';
import styled from 'styled-components';
import {
  Text,
  Pagination,
  TokenLink,
  IPaginationProps,
  Loader,
} from '@unique-nft/ui-kit';

import { getTokenIpfsUriByImagePath } from '@app/utils';
import { NFTsNotFound } from '@app/pages/components/Nfts/NFTsNotFound';
import { TokenPreviewInfo } from '@app/api';

interface NFTsListComponentProps {
  className?: string;
  tokens?: TokenPreviewInfo[];
  tokensCount?: number;
  isLoading: boolean;
  page: number;
  onPageChange: IPaginationProps['onPageChange'];
}

const NFTsListComponent = ({
  className,
  tokens = [],
  tokensCount,
  page,
  onPageChange,
  isLoading,
}: NFTsListComponentProps) => {
  return (
    <div className={classNames('nft-list', className)}>
      {isLoading && <Loader isFullPage={true} size="large" />}
      {!isNaN(Number(tokensCount)) && (
        <div className="token-size-wrapper">
          <Text size="m">{`${tokensCount} items`}</Text>
        </div>
      )}

      {tokensCount === 0 ? (
        <div className="nft-list--empty">
          <NFTsNotFound />
        </div>
      ) : (
        <div className="nft-list--content">
          {tokens.map(
            ({ token_id, token_name, collection_name, collection_id, image_path }) => (
              <TokenLink
                key={`${collection_id}-${token_id}`}
                image={getTokenIpfsUriByImagePath(image_path)}
                link={{
                  href: `/token/${collection_id}/${token_id}`,
                  title: `${collection_name} [id ${collection_id}]`,
                }}
                title={token_name}
              />
            ),
          )}
        </div>
      )}
      {!!tokensCount && (
        <div className="nft-list--footer">
          <Text size="m">{`${tokensCount} items`}</Text>
          <Pagination
            withIcons={true}
            current={page}
            size={tokensCount}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export const NFTsTemplateList = styled(NFTsListComponent)`
  height: 100%;
  display: block;
  padding: calc(var(--prop-gap) * 2);
  box-sizing: border-box;

  .token-size-wrapper {
    margin-bottom: 25px;
  }

  .unique-token-link {
    width: 18%;

    img {
      width: 100%;
      max-width: 100%;
      height: auto;
    }
  }

  .nft-list {
    &--empty {
      display: flex;
      justify-content: center;
    }
    &--content {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 20px 2%;
    }

    &--footer {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding-top: calc(var(--prop-gap) * 2);
    }
  }
`;
