import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import { AttributeSchema, TokenTypeEnum } from '@app/api/graphQL/types';
import { Button } from '@app/components';
import { InputAmount } from '@app/pages/TokenDetails/Modals/Transfer';

import { Modal } from '../../../components/Modal';
import { Attribute, AttributeOption, NewToken } from '../types';
import { AttributesForm, LabelText } from './AttributesForm';
import { TokenBasicCard } from './TokenBasicCard';
import { FormGrid } from './TokenCard';

interface AttribytesModalProps {
  tokens: NewToken[];
  tokenPrefix: string;
  attributesSchema: Record<number, AttributeSchema> | undefined;
  onChange(tokens: NewToken[]): void;
  onClose(): void;
  mode?: TokenTypeEnum;
}

export const AttributesModal = ({
  tokens,
  tokenPrefix,
  attributesSchema,
  onChange,
  onClose,
  mode,
}: AttribytesModalProps) => {
  const [summaryAttributes, setSummaryAttributes] = useState<Attribute[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [totalFractions, setTotalFractions] = useState<Attribute>();

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
        ...(mode === TokenTypeEnum.RFT
          ? {
              totalFractions: (totalFractions as { hasDifferentValues: boolean })
                .hasDifferentValues
                ? token.totalFractions
                : (totalFractions as string),
            }
          : {}),
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
    setSummaryAttributes(summaryAttributes);
    if (mode === TokenTypeEnum.RFT) {
      let totalFractionsValue: Attribute;
      const isDifferent = tokens.some(({ totalFractions }, tokenIndex) => {
        if (tokenIndex === 0) {
          totalFractionsValue = totalFractions;
          return false;
        }
        return totalFractionsValue !== totalFractions;
      });
      setTotalFractions(isDifferent ? { hasDifferentValues: true } : totalFractions);
    }
  }, []);

  if (!attributesSchema) {
    return null;
  }

  return (
    <ModalStyled
      title={`Changing of ${tokens.length} tokens`}
      isVisible={true}
      size="sm"
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
        <FormGrid>
          {mode === TokenTypeEnum.RFT && (
            <>
              <LabelText>Total fractions</LabelText>
              <InputAmount
                label=""
                value={
                  (totalFractions as { hasDifferentValues: boolean }).hasDifferentValues
                    ? ''
                    : (totalFractions as string)
                }
                maxValue={1_000_000_000}
                onChange={setTotalFractions}
                onClear={() => setTotalFractions('')}
              />
            </>
          )}
          <AttributesForm
            initialAttributes={summaryAttributes}
            attributes={attributes}
            attributesSchema={attributesSchema}
            onChange={onChangeAttributes}
          />
        </FormGrid>
      </ModalContent>
      <ModalFooter>
        <Button role="outlined" title="Cancel" onClick={onClose} />
        <Button role="primary" title="Submit" onClick={onSubmit} />
      </ModalFooter>
    </ModalStyled>
  );
};

const ModalStyled = styled(Modal)`
  .unique-modal-content-wrapper {
    width: 90%;
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--prop-gap);
  min-width: 800px;
  @media (max-width: 1024px) {
    min-width: 600px;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    min-width: calc(100vw - 64px);
  }
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
  @media screen and (max-width: 568px) {
    justify-content: center;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: var(--prop-gap);
  margin-top: var(--prop-gap);
`;
