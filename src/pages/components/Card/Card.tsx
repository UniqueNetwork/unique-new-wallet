import { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Avatar, Tag, Text } from '@unique-nft/ui-kit';

import imgUrl from '@app/static/icons/empty-image.svg';

export const PreviewCard = styled.div`
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

export const PreviewCardInfo = styled.div`
  flex: 1 1 auto;
  padding-left: var(--prop-gap);
  word-break: break-word;
`;

export const PreviewCardTitle = styled.h5`
  margin-bottom: calc(var(--prop-gap) / 4);
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.5;
`;

export const PreviewCardDescription = styled(Text).attrs({
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

export const PreviewCardAttributes = styled.div`
  ${PreviewCardDescription} {
    margin-top: calc(var(--prop-gap) / 4);
  }
`;

export const AttributesGroup = styled.div`
  overflow: hidden;

  &:not(:first-of-type),
  & > * {
    margin-top: calc(var(--prop-gap) / 2);
  }

  .unique-tag {
    margin-right: calc(var(--prop-gap) / 2);
    cursor: auto;
  }
`;

interface IPreviewCard {
  attributes?: any[];
  attributesInline?: string[];
  description?: string;
  geometry?: 'square' | 'circle';
  picture?: string;
  title?: string;
}

export const Card: VFC<IPreviewCard> = ({
  attributes,
  attributesInline,
  description = 'Description',
  title = 'Name',
  picture,
  geometry = 'circle',
}) => (
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
                {item.values
                  ?.filter((val: string) => !!val)
                  .map((value: string) => (
                    <Tag key={value} label={value} role="default" />
                  ))}
              </AttributesGroup>
            );
          })}
        </PreviewCardAttributes>
      )}
    </PreviewCardInfo>
  </PreviewCard>
);
