import React, { VFC } from 'react';
import classNames from 'classnames';
import { Avatar, Tag, Text } from '@unique-nft/ui-kit';

import {
  AttributesGroup,
  PreviewCard,
  PreviewCardAttributes,
  PreviewCardDescription,
  PreviewCardInfo,
  PreviewCardTitle,
} from '@app/pages/CreateNFT/components';
import imgUrl from '@app/static/icons/empty-image.svg';

interface IPreviewCard {
  attributes?: any[];
  description?: string;
  geometry?: 'square' | 'circle';
  picture?: string;
  title?: string;
}

export const Card: VFC<IPreviewCard> = ({
  attributes,
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
        <PreviewCardDescription size="s" color="grey-500">
          {description}
        </PreviewCardDescription>
        {attributes && (
          <PreviewCardAttributes>
            <Text size="m">Attributes</Text>
            {attributes.map((item, i) => {
              return (
                <AttributesGroup key={i}>
                  <Text size="s" color="grey-500">
                    {item.group}
                  </Text>
                  {item.values?.map((tag: string, n: number) => (
                    <Tag label={tag} role="default" key={n} />
                  ))}
                </AttributesGroup>
              );
            })}
          </PreviewCardAttributes>
        )}
      </PreviewCardInfo>
    </PreviewCard>
  );
};
