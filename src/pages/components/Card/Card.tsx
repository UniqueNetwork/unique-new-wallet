import { VFC } from 'react';
import styled from 'styled-components';

import { Tag, Tags, Avatar } from '@app/components';
import { AttributeView } from '@app/pages/CreateNFT/types';
import { usePreloadImage } from '@app/hooks/usePreloadImage';
import noImage from '@app/static/icons/no-collections.svg';

import { Typography } from '../../../components/Typography/Typography';

interface IPreviewCard {
  attributes?: AttributeView[];
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
}) => {
  return (
    <PreviewCard>
      <Avatar size={64} src={usePreloadImage(picture || '', noImage)} type={geometry} />
      <PreviewCardInfo>
        <PreviewCardTitle>{title}</PreviewCardTitle>
        <PreviewCardDescription>{description}</PreviewCardDescription>
        {(attributes || !!attributesInline?.length) && (
          <PreviewCardAttributes>
            <Typography size="m">
              {attributesInline ? 'Attribute names' : 'Attributes'}
            </Typography>
            {attributesInline && (
              <PreviewCardDescription>
                {attributesInline.map(
                  (el, i) =>
                    el && `${el}${i !== attributesInline?.length - 1 ? ', ' : ''}`,
                )}
              </PreviewCardDescription>
            )}
            {attributes?.map((item, i) => {
              return (
                <AttributesGroup key={i}>
                  <Typography size="s" color="grey-500">
                    {item.group}
                  </Typography>
                  {item.values && (
                    <Tags>
                      {item.values
                        .filter((val: string) => !!val)
                        .map((value: string, index) => (
                          <Tag key={`${value}-${index}`} label={value} type="default" />
                        ))}
                    </Tags>
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

const PreviewCard = styled.div`
  display: flex;
  word-break: break-all;

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

const PreviewCardDescription = styled(Typography).attrs({
  size: 's',
  color: 'grey-500',
})`
  &:not(:last-child) {
    margin-bottom: var(--prop-gap);
  }

  &.unique-text {
    font-weight: 400;
    word-break: break-word;
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
