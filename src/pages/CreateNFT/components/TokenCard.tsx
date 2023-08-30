import styled from 'styled-components';
import { TemplateProps } from 'react-draggable-list';
import { MouseEventHandler, TouchEventHandler, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { AttributeSchema, TokenTypeEnum } from '@app/api/graphQL/types';
import { Button, InputText } from '@app/components';

import { Checkbox } from '../../../components/Checkbox';
import { Image } from '../../../components/Image';
import { Typography } from '../../../components/Typography';
import { Attribute, NewToken, ViewMode } from '../types';
import { AttributesForm, LabelText } from './AttributesForm';

export type TokenCardCommonProps = {
  onChange(token: NewToken): void;
  onRemove(id: number): void;
  tokenPrefix: string;
  attributesSchema: Record<number, AttributeSchema>;
  mode: TokenTypeEnum | undefined;
  viewMode: ViewMode;
};

export type TokenCardProps = TemplateProps<NewToken, TokenCardCommonProps>;

export const TokenCard = ({
  item,
  itemSelected,
  dragHandleProps,
  commonProps,
}: TokenCardProps) => {
  const { id, tokenId, image, attributes, isValid, isSelected, totalFractions } = item;
  const { onChange, onRemove, tokenPrefix, attributesSchema, mode, viewMode } =
    commonProps;
  const [willBeRemoved, setWillBeRemoved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { onMouseDown, onTouchStart } = dragHandleProps as {
    onMouseDown: MouseEventHandler<HTMLDivElement> | undefined;
    onTouchStart: TouchEventHandler<HTMLDivElement> | undefined;
  };

  const onSelect = () => {
    onChange({ id, tokenId, image, attributes, isValid, isSelected: !isSelected });
  };

  const onAttributesChange = (attributes: Attribute[]) => {
    onChange({ id, tokenId, image, attributes, isValid, isSelected });
  };

  const onStartRemove = () => {
    setWillBeRemoved(true);
    setTimeout(() => {
      onRemove(id);
    }, 250);
  };

  return (
    <TokenWrapper
      id={`token-${id}`}
      className={classNames({
        removing: willBeRemoved,
        hovered,
        grid: viewMode === ViewMode.grid,
      })}
    >
      <TokenBasicWrapper>
        <TokenLinkImageWrapper
          onMouseEnter={(e) => {
            e.preventDefault();
            setHovered(true);
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            setHovered(false);
          }}
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
            iconLeft={{ name: 'trash', size: 24 }}
            onClick={onStartRemove}
          />
        </TokenCardActions>
      </TokenBasicWrapper>
      {viewMode === ViewMode.list && (
        <FormGrid>
          {mode === TokenTypeEnum.RFT && (
            <>
              <LabelText>Total fractions</LabelText>
              <InputText
                label=""
                value={totalFractions}
                maxLength={10}
                onChange={(value) =>
                  !Number.isNaN(Number(value)) &&
                  onChange({ ...item, totalFractions: value })
                }
                onClear={() => onChange({ ...item, totalFractions: '' })}
              />
            </>
          )}
          <AttributesForm
            initialAttributes={attributes}
            attributes={attributes}
            attributesSchema={attributesSchema}
            isValid={isValid}
            onChange={onAttributesChange}
          />
        </FormGrid>
      )}
    </TokenWrapper>
  );
};

const TokenWrapper = styled.div`
  font-family: var(--prop-font-family);
  font-size: var(--prop-font-size);
  font-weight: var(--prop-font-weight);
  word-break: break-all;
  min-height: 300px;
  cursor: pointer;
  padding: 8px 32px 0 32px;
  display: flex;
  background: white;
  border-style: none none dashed none;
  border-color: var(--color-grey-100);
  gap: var(--prop-gap);
  transition: opacity 0.2s, transform 0.2s;
  &.hovered {
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  &.removing {
    transform: scale(0.1);
    opacity: 0;
    max-height: 0;
  }

  &.grid {
    min-height: unset;
    padding: 16px 16px 0 16px;
    border-style: none;
    & > div {
      width: 100%;
      & > div {
        width: 100%;
        height: unset;
      }
    }
  }

  @media screen and (max-width: 568px) {
    flex-direction: column;
    padding-bottom: 16px;
  }
`;

const TokenBasicWrapper = styled.div`
  display: block;
`;

const TokenLinkImageWrapper = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  @media screen and (max-width: 768px) {
    width: 180px;
    height: 180px;
  }
  @media screen and (max-width: 568px) {
    width: 100%;
    height: auto;
  }
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
    &:hover {
      svg {
        fill: var(--color-primary-500);
        transition: 0.2s;
      }
    }
  }
  @media screen and (max-width: 768px) {
    width: 180px;
  }
  @media screen and (max-width: 568px) {
    width: 100%;
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

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--prop-gap);
  max-width: 800px;
  flex: 1;
  width: 100%;
  align-self: flex-start;
  & > .unique-text {
    margin: 0;
    white-space: break-spaces;
    word-break: normal;
  }
  h4.unique-font-heading.size-4 {
    grid-column: 1 / span 2;

    @media screen and (max-width: 568px) {
      grid-column: 1 / span 1;
    }
  }
  .unique-input-text {
    width: 100%;
    margin: auto 0;
  }
  div.unique-select {
    width: 100%;
    margin: auto 0;
  }
  @media screen and (max-width: 568px) {
    grid-template-columns: 1fr;
    gap: calc(var(--prop-gap) / 2);
  }
`;
