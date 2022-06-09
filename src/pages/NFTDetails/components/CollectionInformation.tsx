import React, { memo, VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Avatar, Heading, Text } from '@unique-nft/ui-kit';

interface CollectionInformationProps {
  avatar?: string;
  title?: string;
  description?: string;
  className?: string;
}

const CollectionInformationComponent: VFC<CollectionInformationProps> = ({
  avatar,
  description,
  title,
  className,
}) => {
  return (
    <div className={classNames(className, 'collection-information')}>
      <Avatar src={avatar ?? ''} size={64} type="circle" />
      <div className="collection-content">
        <Heading size="4" className="collection-title">
          {title ?? ''}
        </Heading>
        {!!description && (
          <Text
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
    display: block;
    max-width: 724px;
  }
`);
