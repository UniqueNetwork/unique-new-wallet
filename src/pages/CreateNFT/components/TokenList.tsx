import {
  ChangeEvent,
  DragEvent,
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import DraggableList from 'react-draggable-list';
import classNames from 'classnames';

import { Icon, Typography } from '@app/components';
import { AttributeSchema, TokenTypeEnum } from '@app/api/graphQL/types';
import { DeviceSize, useDeviceSize } from '@app/hooks';
import { swap } from '@app/components/DraggableGrid/helpers';
import {
  DraggableGridContextProvider,
  DraggableGridItem,
  DraggableGrid,
} from '@app/components/DraggableGrid';

import { AttributeOption, NewToken, ViewMode } from '../types';
import { TokenCard, TokenCardCommonProps, TokenCardProps } from './TokenCard';
import { Filter } from './Filter';
import { getAttributesFromTokens } from '../helpers';
import { AttributesModal } from './AttributesModal';
import { AttributeFilterContext } from '../contexts/AttributesFilterContext';

export type TokenListProps = {
  disabled: boolean;
  viewMode: ViewMode;
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
  viewMode,
  onChange,
  onAddTokens,
}: TokenListProps) => {
  const deviceSize = useDeviceSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragEnter, setDragEnter] = useState(false);
  const [editingToken, setEditingToken] = useState<NewToken>();

  const { attributes, setAttributes, selectedAttributes, setSelectedAttributes } =
    useContext(AttributeFilterContext);

  const onTokenChange = (token: NewToken) => {
    const index = tokens.findIndex(({ id }) => id === token.id);

    onChange([...tokens.slice(0, index), token, ...tokens.slice(index + 1)]);
  };

  const onTokenRemove = (id: number) => {
    const lastId = (tokensStartId || 0) + 1;
    const _tokens = [
      ...tokens
        .filter((token) => id !== token.id)
        .map((token, index) => ({ ...token, tokenId: lastId + index })),
    ];
    onChange(_tokens);
  };

  const onDragStart = () => {
    //setDragEnter(true);
  };
  const onDragEnd = () => {
    setDragEnter(false);
  };

  const onDragItemStart = () => {
    setDragEnter(false);
  };

  const onGridItemSwapped = (
    sourceId: string,
    sourceIndex: number,
    targetIndex: number,
  ) => {
    const lastId = (tokensStartId || 0) + 1;
    onChange(
      swap(tokens, sourceIndex, targetIndex).map((token, index) => ({
        ...token,
        tokenId: lastId + index,
      })),
    );
  };

  useEffect(() => {
    const attributes = getAttributesFromTokens(attributesSchema, tokens);
    setAttributes(attributes);
    setSelectedAttributes(
      selectedAttributes.filter(
        ({ key, value }) =>
          !!attributes[key] && attributes[key].some((attr) => attr.value === value),
      ),
    );
  }, [tokens, attributesSchema]);

  const filteredTokens = useMemo(() => {
    if (selectedAttributes.length === 0) {
      return tokens;
    }
    return tokens.filter(({ attributes }) => {
      return attributes.some((attribute, index) => {
        if (!attribute) {
          return false;
        }
        return selectedAttributes.some((selectedAttribute) => {
          if (selectedAttribute.index !== index) {
            return false;
          }
          if (Array.isArray(attribute)) {
            return (attributes as AttributeOption[]).some(
              ({ id }) => selectedAttribute.id === id,
            );
          }
          if (typeof attribute === 'string') {
            return selectedAttribute.value === attribute;
          }
          return selectedAttribute.id === (attribute as AttributeOption).id;
        });
      });
    });
  }, [tokens, selectedAttributes]);

  return (
    <TokenListWrapper
      onDragEnter={onDragStart}
      onDragEnd={onDragEnd}
      onDragExit={onDragEnd}
    >
      {tokens.length === 0 && <Stub />}
      <ImageUploadArea
        disabled={disabled}
        hasTokens={tokens.length > 0}
        hidden={!dragEnter && tokens.length > 0}
        onUpload={onAddTokens}
        onDragExit={onDragEnd}
      />
      {tokens.length !== 0 && (
        <>
          {deviceSize > DeviceSize.sm && (
            <Filter
              attributes={attributes}
              selectedAttributes={selectedAttributes}
              onChange={setSelectedAttributes}
            />
          )}
          <DraggableContainer ref={containerRef}>
            {viewMode === ViewMode.grid && (
              <DraggableGridContextProvider onChange={onGridItemSwapped}>
                <DraggableGrid
                  itemsPerRow={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
                  id="tokens-grid"
                >
                  {filteredTokens.map((token, index) => (
                    <DraggableGridItem
                      key={token.id}
                      id={token.id.toString()}
                      onDragStart={onDragItemStart}
                    >
                      <TokenCard
                        key={token.id}
                        itemSelected={0}
                        anySelected={0}
                        item={token}
                        commonProps={{
                          mode,
                          viewMode,
                          tokenPrefix,
                          attributesSchema,
                          onChange: onTokenChange,
                          onRemove: onTokenRemove,
                          onOpenModifyModal: setEditingToken,
                        }}
                        dragHandleProps={{}}
                      />
                    </DraggableGridItem>
                  ))}
                </DraggableGrid>
              </DraggableGridContextProvider>
            )}
            {viewMode === ViewMode.list && (
              <>
                {/* @ts-ignore */}
                <DraggableList<NewToken, TokenCardCommonProps, FC<TokenCardProps>>
                  constrainDrag
                  unsetZIndex
                  className="draggable-container"
                  itemKey="id"
                  template={TokenCard}
                  list={filteredTokens}
                  container={() => containerRef.current}
                  commonProps={{
                    viewMode,
                    mode,
                    tokenPrefix,
                    attributesSchema,
                    onChange: onTokenChange,
                    onRemove: onTokenRemove,
                  }}
                  onMoveEnd={(newList) => {
                    const lastId = (tokensStartId || 0) + 1;
                    return onChange([
                      ...newList.map((token, index) => ({
                        ...token,
                        tokenId: lastId + index,
                      })),
                    ]);
                  }}
                />
              </>
            )}
          </DraggableContainer>
        </>
      )}
      {!!editingToken && (
        <AttributesModal
          tokens={[editingToken]}
          tokenPrefix={tokenPrefix}
          attributesSchema={attributesSchema}
          onClose={() => setEditingToken(undefined)}
          onChange={(_tokens: NewToken[]) => {
            const token = _tokens[0];
            if (!token) {
              return;
            }
            onChange(
              tokens.map((_token) => {
                if (_token.tokenId !== token.tokenId) {
                  return _token;
                }
                return {
                  ..._token,
                  attributes: token.attributes,
                };
              }),
            );
          }}
        />
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
  }
  .unique-list {
    gap: 0;
  }
  @media screen and (max-width: 768px) {
    margin: 0;
  }
`;

type ImageUploadAreaProps = {
  disabled: boolean;
  hasTokens: boolean;
  hidden: boolean;
  onUpload?(images: File[]): void;
  onDragExit(): void;
};

const ImageUploadArea = ({
  disabled,
  hasTokens,
  hidden,
  onUpload,
  onDragExit,
}: ImageUploadAreaProps) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [isDragEnter, setIsDragEnter] = useState(false);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsDragEnter(false);
    if (!inputFile.current) {
      return;
    }
    onUpload?.(Array.from(inputFile.current.files || []));
    onDragExit();

    inputFile.current.value = '';
  };

  const onDragEnter = (event: DragEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    setIsDragEnter(true);
  };

  const onDragLeave = (event: DragEvent<HTMLInputElement>) => {
    setIsDragEnter(false);
    onDragExit();
  };

  return (
    <UploadWrapper
      className={classNames({
        hidden,
        'drag-enter': isDragEnter,
        'full-area': !hasTokens,
      })}
    >
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
  left: 300px;
  right: 0;
  border: 1px dashed var(--color-primary-500);
  z-index: 1000;
  &.full-area {
    left: 0;
  }
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
