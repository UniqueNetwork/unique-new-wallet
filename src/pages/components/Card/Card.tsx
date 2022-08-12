import { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Avatar, Tag, Text } from '@unique-nft/ui-kit';

import imgUrl from '@app/static/icons/empty-image.svg';
import { AttributeView } from '@app/pages/CreateNFT/types';

interface IPreviewCard {
  attributes?: AttributeView[];
  attributesInline?: string[];
  description?: string;
  geometry?: 'square' | 'circle';
  picture?: string;
  title?: string;
}

const PreviewCard = styled.div`
  display: flex;

  .unique-text {
    display: block;
  }

  .unique-avatar {
    outline: none;
    background-color: #f5f6f7;
    object-fit: cover;

    &.square {
      border-radius: var(--prop-border-radius);
    }
  }

  ._empty-picture {
    .unique-avatar {
      object-fit: none;
    }
  }
`;

const PreviewCardInfo = styled.div`
  overflow: hidden;
  flex: 1 1 auto;
  padding-left: var(--prop-gap);
`;

const PreviewCardTitle = styled.h5`
  margin-bottom: calc(var(--prop-gap) / 4);
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.5;
`;

const PreviewCardDescription = styled(Text).attrs({
  size: 's',
  color: 'grey-500',
})`
  &:not(:last-child) {
    margin-bottom: var(--prop-gap);
  }

  &.unique-text {
    font-weight: 400;
  }
`;

const PreviewCardAttributes = styled.div`
  ${PreviewCardDescription} {
    margin-top: calc(var(--prop-gap) / 4);
  }
`;

const AttributesGroup = styled.div`
  overflow: hidden;
  margin-top: calc(var(--prop-gap) / 2);

  &:not(:first-of-type) {
    margin-top: var(--prop-gap);
  }
`;

const AttributeTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: calc(var(--prop-gap) / (-2));

  & > span {
    margin-top: calc(var(--prop-gap) / 2);
  }

  .unique-tag-wrapper {
    overflow: hidden;
    max-width: 100%;
    margin-left: calc(var(--prop-gap) / 2);

    .unique-tag {
      overflow: hidden;
      max-width: calc(100% - 18px);
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: auto;
    }
  }
`;

export const Card: VFC<IPreviewCard> = ({
  attributes,
  attributesInline,
  description = 'Description',
  title = 'Name',
  picture,
  geometry = 'circle',
}) => {
  return (
    <PreviewCard>
      <div className={classNames({ '_empty-picture': picture === undefined })}>
        <Avatar size={64} src={picture || imgUrl} type={geometry} />
      </div>
      <PreviewCardInfo>
        <PreviewCardTitle>{title}</PreviewCardTitle>
        <PreviewCardDescription>{description}</PreviewCardDescription>
        {(attributes || attributesInline) && (
          <PreviewCardAttributes>
            <Text size="m">{attributesInline ? 'Attribute names' : 'Attributes'}</Text>
            {attributesInline && (
              <PreviewCardDescription>
                {attributesInline?.join(', ')}
              </PreviewCardDescription>
            )}
            {attributes?.map((item, i) => {
              return (
                <AttributesGroup key={i}>
                  <Text size="s" color="grey-500">
                    {item.group}
                  </Text>
                  {item.values && (
                    <AttributeTags>
                      {item.values
                        .filter((val: string) => !!val)
                        .map((value: string) => (
                          <span className="unique-tag-wrapper" key={value} title={value}>
                            <Tag label={value} role="default" />
                          </span>
                        ))}
                    </AttributeTags>
                  )}
                </AttributesGroup>
              );
            })}
          </PreviewCardAttributes>
        )}
      </PreviewCardInfo>
    </PreviewCard>
  );
};
