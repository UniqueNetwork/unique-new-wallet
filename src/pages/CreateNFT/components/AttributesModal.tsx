import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import { AttributeSchema } from '@app/api/graphQL/types';
import { Button, Modal } from '@app/components';

import { Attribute, AttributeOption, NewToken } from '../types';
import { AttributesForm } from './AttributesForm';
import { TokenBasicCard } from './TokenBasicCard';

interface AttribytesModalProps {
  tokens: NewToken[];
  tokenPrefix: string;
  attributesSchema: Record<number, AttributeSchema> | undefined;
  onChange(tokens: NewToken[]): void;
  onClose(): void;
}

export const AttributesModal = ({
  tokens,
  tokenPrefix,
  attributesSchema,
  onChange,
  onClose,
}: AttribytesModalProps) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const onChangeAttributes = (attributes: Attribute[]) => {
    setAttributes(attributes);
  };

  const onSubmit = () => {
    onChange(
      tokens.map((token) => ({
        ...token,
        attributes: attributes.map((attribute, index) => {
          if ((attribute as { hasDifferentValues: boolean })?.hasDifferentValues) {
            return token.attributes[index];
          }
          return attribute;
        }),
      })),
    );
    onClose();
  };

  useEffect(() => {
    const summaryAttributes = Object.values(attributesSchema || {}).map(
      ({ isArray, enumValues }, index) => {
        let value: Attribute;
        const isDifferent = tokens.some(({ attributes }, tokenIndex) => {
          if (tokenIndex === 0) {
            value = attributes[index];
            return false;
          }
          if (isArray) {
            return { hasDifferentValues: true };
          }
          if (enumValues) {
            return (
              (attributes[index] as AttributeOption)?.id !==
              (value as AttributeOption)?.id
            );
          }
          return attributes[index] !== value;
        });
        if (isDifferent) {
          return { hasDifferentValues: true };
        }
        return value;
      },
    );
    setAttributes(summaryAttributes);
  }, []);

  if (!attributesSchema) {
    return null;
  }

  return (
    <Modal
      title={`Massive changing of ${tokens.length} tokens`}
      isVisible={true}
      size="lg"
      onClose={onClose}
    >
      <ModalContent>
        <TokensImages className="slide-container">
          <Slide autoplay={false} transitionDuration={150}>
            {tokens.map((token) => {
              return (
                <TokenBasicCard key={token.id} token={token} tokenPrefix={tokenPrefix} />
              );
            })}
          </Slide>
        </TokensImages>
        <AttributesForm
          attributes={attributes}
          attributesSchema={attributesSchema}
          onChange={onChangeAttributes}
        />
      </ModalContent>
      <ModalFooter>
        <Button role="outlined" title="Cancel" onClick={onClose} />
        <Button role="primary" title="Submit" onClick={onSubmit} />
      </ModalFooter>
    </Modal>
  );
};

export const ModalContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--prop-gap);
  min-width: 800px;
`;

export const TokensImages = styled.div`
  display: flex;
  .react-slideshow-container {
    width: 250px;
  }
  .each-slide-effect > div {
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    height: 350px;
  }

  .each-slide-effect span {
    padding: 20px;
    font-size: 20px;
    background: #efefef;
    text-align: center;
  }

  .default-nav:last-of-type {
    right: 4px;
  }
  .default-nav:first-of-type {
    left: 4px;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: var(--prop-gap);
  margin-top: 16px;
`;
