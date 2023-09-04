import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import { BottomBar, BottomBarHeader } from '@app/pages/components/BottomBar';
import { Button } from '@app/components';
import { DeviceSize, useDeviceSize } from '@app/hooks';

import { Filter } from './Filter';
import { AttributeFilterContext } from '../contexts/AttributesFilterContext';
import { AttributeForFilter } from '../types';

export const MobileFilters = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible(value: boolean): void;
}) => {
  const deviceSize = useDeviceSize();

  const { attributes, selectedAttributes, setSelectedAttributes } =
    useContext(AttributeFilterContext);
  const [preSelectedAttributes, setPreSelectedAttributes] = useState<
    AttributeForFilter[]
  >([]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    setPreSelectedAttributes(selectedAttributes);
  }, [selectedAttributes, isVisible]);

  useEffect(() => {
    if (deviceSize > DeviceSize.sm) {
      setIsVisible(false);
    }
  }, [deviceSize]);

  const onBackButtonClick = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const onApplyButtonClick = useCallback(() => {
    setSelectedAttributes(preSelectedAttributes);
    setIsVisible(false);
  }, [preSelectedAttributes]);

  const onResetButtonClick = useCallback(() => {
    setPreSelectedAttributes([]);
  }, [setIsVisible]);

  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  });

  return (
    <>
      <BottomBar
        header={<BottomBarHeader title="Filter" onBackClick={onBackButtonClick} />}
        buttons={[null]}
        isOpen={isVisible}
        parent={document.body}
      >
        <FiltersWrapper>
          <Filter
            attributes={attributes}
            selectedAttributes={preSelectedAttributes}
            onChange={setPreSelectedAttributes}
          />
        </FiltersWrapper>
        <ButtonsGroup>
          <Button key="Filter-apply-button" title="Apply" onClick={onApplyButtonClick} />
          <Button
            key="Filter-reset-button"
            role="danger"
            title="Reset All"
            onClick={onResetButtonClick}
          />
        </ButtonsGroup>
      </BottomBar>
    </>
  );
};

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--prop-gap) * 2);
  max-width: 756px;

  .filter-input {
    width: auto;
    max-width: 100%;
  }

  & > div {
    width: 100%;
    border-right: none;
  }
`;

const ButtonsGroup = styled.div`
  position: absolute;
  bottom: 0;
  padding: calc(var(--prop-gap) / 1.6) calc(var(--prop-gap) / 2);
  display: flex;
  gap: calc(var(--prop-gap) / 2);
  left: 0;
  right: 0;
  button {
    flex: 1 1;
  }
  @media screen and (min-width: 568px) {
    button {
      flex: unset;
    }
  }
`;
