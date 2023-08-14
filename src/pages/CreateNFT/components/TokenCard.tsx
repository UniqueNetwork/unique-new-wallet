import styled from 'styled-components';
import { TemplateProps } from 'react-draggable-list';
import { FC, MouseEventHandler, TouchEventHandler, useState } from 'react';

import { AttributeSchema, TokenTypeEnum } from '@app/api/graphQL/types';
import { Button, Icon } from '@app/components';

import { Checkbox } from '../../../components/Checkbox';
import { Image } from '../../../components/Image';
import { Typography } from '../../../components/Typography';
import { Attribute, NewToken } from '../types';
import trash from '../../../static/icons/trash.svg';
import { AttributesForm } from './AttributesForm';

export type TokenCardCommonProps = {
  onChange(token: NewToken): void;
  onRemove(id: number): void;
  tokenPrefix: string;
  attributesSchema: Record<number, AttributeSchema>;
  mode: TokenTypeEnum | undefined;
};

export type TokenCardProps = TemplateProps<NewToken, TokenCardCommonProps>;

export const TokenCard = ({
  item,
  itemSelected,
  dragHandleProps,
  commonProps,
}: TokenCardProps) => {
  const { id, tokenId, image, attributes, isReady, isSelected } = item;
  const { onChange, onRemove, tokenPrefix, attributesSchema } = commonProps;
  const [willBeRemoved, setWillBeRemoved] = useState(false);
  const { onMouseDown, onTouchStart } = dragHandleProps as {
    onMouseDown: MouseEventHandler<HTMLDivElement> | undefined;
    onTouchStart: TouchEventHandler<HTMLDivElement> | undefined;
  };

  const onSelect = () => {
    onChange({ id, tokenId, image, attributes, isReady, isSelected: !isSelected });
  };

  const onAttributesChange = (attributes: Attribute[]) => {
    onChange({ id, tokenId, image, attributes, isReady, isSelected });
  };

  const onStartRemove = () => {
    setWillBeRemoved(true);
    setTimeout(() => {
      onRemove(id);
    }, 250);
  };

  return (
    <TokenWrapper className={willBeRemoved ? 'removing' : ''}>
      <TokenBasicWrapper>
        <TokenLinkImageWrapper
          onTouchStart={(e) => {
            e.preventDefault();
            onTouchStart?.(e);
          }}
          onMouseDown={(e) => {
            onMouseDown?.(e);
          }}
        >
          <TokenImage alt={`${tokenPrefix}_${id}`} image={image.url} />
          <SelectCheckbox label="" checked={isSelected} onChange={onSelect} />
        </TokenLinkImageWrapper>
        <TokenCardActions>
          <TokenLinkTitle>{`${tokenPrefix} #${tokenId}`}</TokenLinkTitle>
          <Button
            title=""
            role="ghost"
            iconLeft={{ file: trash, size: 24 }}
            onClick={onStartRemove}
          />
        </TokenCardActions>
      </TokenBasicWrapper>
      <AttributesForm
        attributes={attributes}
        attributesSchema={attributesSchema}
        onChange={onAttributesChange}
      />
    </TokenWrapper>
  );
};

const TokenWrapper = styled.div`
  width: 100%;
  font-family: var(--prop-font-family);
  font-size: var(--prop-font-size);
  font-weight: var(--prop-font-weight);
  word-break: break-all;
  min-height: 300px;
  cursor: pointer;
  padding-top: 8px;
  display: flex;
  background: white;
  border-style: none none dashed none;
  border-color: var(--color-grey-300);
  &.removing {
    transform: scale(0.1);
    opacity: 0;
    transition: 0.2s;
    max-height: 0;
  }
`;

const TokenBasicWrapper = styled.div`
  display: block;
`;

const TokenLinkImageWrapper = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
`;

const TokenImage = styled(Image)`
  margin-bottom: calc(var(--prop-gap) / 2);
`;

const TokenCardActions = styled.div`
  padding: calc(var(--prop-gap) / 2) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 250px;
  background-color: white;
  .unique-button {
    padding: 0;
  }
`;

const TokenLinkTitle = styled(Typography).attrs({ appearance: 'block', size: 'l' })`
  word-break: break-all;
`;
const SelectCheckbox = styled(Checkbox)`
  position: absolute;
  top: var(--prop-gap);
  left: var(--prop-gap);
  &.unique-checkbox-wrapper.checkbox-size-s span.checkmark {
    height: 32px;
    width: 32px;
    border-radius: var(--prop-gap);
    background-color: var(--color-primary-500);
    opacity: 0.4;
    &.checked {
      opacity: 1;
    }
  }
`;
