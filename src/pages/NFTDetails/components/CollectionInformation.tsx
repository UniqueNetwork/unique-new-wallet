import React, { memo, VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Avatar, Heading, Text } from '@unique-nft/ui-kit';

import { getTokenIpfsUriByImagePath } from '@app/utils';

interface CollectionInformationProps {
  avatar?: string;
  title?: string;
  description?: string;
  className?: string;
}

const CollectionInformationComponent: VFC<CollectionInformationProps> = ({
  avatar = '',
  title = '',
  description,
  className,
}) => {
  return (
    <div className={classNames(className, 'collection-information')}>
      <Avatar src={getTokenIpfsUriByImagePath(avatar)} size={64} type="circle" />
      <div className="collection-content">
        <Heading size="4" className="collection-title">
          {title}
        </Heading>
        {!!description && (
          <Text
            appearance="block"
            size="s"
            weight="light"
            color="grey-500"
            className="collection-description"
          >
            {description}
          </Text>
        )}
      </div>
    </div>
  );
};

export const CollectionInformation = memo(styled(CollectionInformationComponent)`
  &.collection-information {
    max-width: 1200px;
    display: flex;
    gap: 16px;
  }

  .collection-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .collection-title {
    margin: 0;
    max-width: 724px;
  }

  .collection-description {
    max-width: 724px;
  }
`);
