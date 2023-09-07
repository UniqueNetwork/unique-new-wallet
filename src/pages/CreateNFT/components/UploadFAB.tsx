import styled from 'styled-components';
import { useRef, useState, ChangeEvent, DragEvent } from 'react';

import { Button, Tooltip } from '@app/components';

interface UploadFABProps {
  onUpload(files: File[]): void;
}

export const UploadFAB = ({ onUpload }: UploadFABProps) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!inputFile.current) {
      return;
    }
    onUpload?.(Array.from(inputFile.current.files || []));

    inputFile.current.value = '';
  };

  const buttonRef = useRef<HTMLDivElement>(null);

  return (
    <FABContainer ref={buttonRef}>
      <input
        ref={inputFile}
        type="file"
        multiple={true}
        accept="image/*"
        onChange={onChange}
      />
      <Tooltip
        targetRef={buttonRef}
        align={{ horizontal: 'left', vertical: 'middle', appearance: 'horizontal' }}
      >
        Add more files
      </Tooltip>
      <Button
        iconLeft={{ name: 'plus', color: 'white', size: 24 }}
        role="primary"
        title=""
        onClick={() => inputFile.current?.click()}
      />
    </FABContainer>
  );
};

const FABContainer = styled.div`
  position: absolute;
  right: 64px;
  margin-top: -128px;
  z-index: 1002;
  input {
    opacity: 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
  button.unique-button.size-middle {
    height: 52px;
    width: 52px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    position: relative;
    svg {
      margin: 0;
    }
  }
  @media screen and (max-width: 768px) {
    margin-top: -64px;
    right: 32px;
  }
`;
