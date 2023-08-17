import { ChangeEvent, DragEvent, FC, useRef, useState } from 'react';
import styled from 'styled-components';
import DraggableList from 'react-draggable-list';
import classNames from 'classnames';

import { Icon, Typography } from '@app/components';
import { AttributeSchema, TokenTypeEnum } from '@app/api/graphQL/types';

import { NewToken } from '../types';
import { TokenCard, TokenCardCommonProps, TokenCardProps } from './TokenCard';

export type TokenListProps = {
  disabled: boolean;
  tokens: NewToken[];
  tokenPrefix: string;
  tokensLimit?: number;
  tokensStartId?: number;
  attributesSchema: Record<number, AttributeSchema>;
  mode: TokenTypeEnum | undefined;
  onChange(tokens: NewToken[]): void;
  onAddTokens(files: File[]): void;
};

export const TokenList = ({
  mode,
  tokens,
  tokenPrefix,
  tokensLimit,
  tokensStartId,
  disabled,
  attributesSchema,
  onChange,
  onAddTokens,
}: TokenListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragEnter, setDragEnter] = useState(false);

  const onTokenChange = (token: NewToken) => {
    const index = tokens.findIndex(({ id }) => id === token.id);

    onChange([...tokens.slice(0, index), token, ...tokens.slice(index + 1)]);
  };

  const onTokenRemove = (id: number) => {
    const lastId = (tokensStartId || 0) + 1;
    onChange([
      ...tokens
        .filter((token) => id !== token.id)
        .map((token, index) => ({ ...token, tokenId: lastId + index })),
    ]);
  };

  return (
    <TokenListWrapper
      onDragEnter={() => setDragEnter(true)}
      onDrop={() => setDragEnter(false)}
      onDragLeave={() => setDragEnter(false)}
      onDragEnd={() => setDragEnter(false)}
      onDragExit={() => setDragEnter(false)}
    >
      {tokens.length === 0 && <Stub />}
      <ImageUploadArea
        disabled={disabled}
        hidden={!dragEnter && tokens.length > 0}
        onUpload={onAddTokens}
      />
      {tokens.length !== 0 && (
        <DraggableContainer ref={containerRef}>
          {/* @ts-ignore */}
          <DraggableList<NewToken, TokenCardCommonProps, FC<TokenCardProps>>
            constrainDrag
            unsetZIndex
            className="draggable-container"
            itemKey="id"
            template={TokenCard}
            list={tokens}
            container={() => containerRef.current}
            commonProps={{
              mode,
              tokenPrefix,
              attributesSchema,
              onChange: onTokenChange,
              onRemove: onTokenRemove,
            }}
            onMoveEnd={(newList) => {
              const lastId = (tokensStartId || 0) + 1;
              return onChange([
                ...newList.map((token, index) => ({ ...token, tokenId: lastId + index })),
              ]);
            }}
          />
        </DraggableContainer>
      )}
    </TokenListWrapper>
  );
};

const TokenListWrapper = styled.div`
  display: flex;
  margin-top: calc(var(--prop-gap) * 2);
  margin-bottom: calc(var(--prop-gap) * 2);
  min-height: calc(80vh - 444px);
  position: relative;
`;

const DraggableContainer = styled.div`
  width: 100%;
  margin: 0 -32px;
  & > div {
    width: 100%;
    /* & > div {
      margin-bottom: 0 !important;
    } */
  }
`;

type ImageUploadAreaProps = {
  disabled: boolean;
  hidden: boolean;
  onUpload?(images: File[]): void;
};

const ImageUploadArea = ({ disabled, hidden, onUpload }: ImageUploadAreaProps) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [isDragEnter, setIsDragEnter] = useState(false);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsDragEnter(false);
    if (!inputFile.current) {
      return;
    }
    onUpload?.(Array.from(inputFile.current.files || []));

    inputFile.current.value = '';
  };

  const onDragEnter = (event: DragEvent<HTMLInputElement>) => {
    console.log('onDragEnter');

    if (disabled) {
      return;
    }
    setIsDragEnter(true);
  };

  const onDragLeave = (event: DragEvent<HTMLInputElement>) => {
    setIsDragEnter(false);
  };

  return (
    <UploadWrapper className={classNames({ hidden, 'drag-enter': isDragEnter })}>
      <input
        disabled={disabled}
        ref={inputFile}
        type="file"
        multiple={true}
        title="Click to select or drop files here"
        accept="image/*"
        onChange={onChange}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragEnd={onDragLeave}
        onDragExit={onDragLeave}
      />
    </UploadWrapper>
  );
};

const UploadWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px dashed var(--color-primary-500);
  z-index: 1000;
  &.hidden {
    opacity: 0;
    z-index: 0;
  }
  input {
    opacity: 0;
    width: 100%;
    height: 100%;
  }
  &:before {
    position: absolute;
    content: '';
    border-radius: var(--prop-border-radius);
    width: 0;
    height: 0;
    opacity: 0;
    top: 50%;
    left: 50%;
    background-color: var(--color-primary-500);
    transition: 0.3s;
  }
  &.drag-enter:before {
    width: 100%;
    height: 100%;
    opacity: 0.4;
    top: 0;
    left: 0;
  }
`;

const Stub = () => {
  return (
    <StubWrapper>
      <Icon name="empty-image" size={80} />
      <Typography color="blue-grey-500" size="m" weight="light">
        Click to select or drop files here
      </Typography>
    </StubWrapper>
  );
};

const StubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  svg {
    margin-bottom: var(--prop-gap);
  }
`;
