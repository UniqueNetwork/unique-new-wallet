import styled from 'styled-components';
import { useRef, useState, ChangeEvent, DragEvent } from 'react';

import { Button } from '@app/components';

interface UploadFABProps {
  onUpload(files: File[]): void;
}

export const UploadFAB = ({ onUpload }: UploadFABProps) => {
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
    setIsDragEnter(true);
  };

  const onDragLeave = (event: DragEvent<HTMLInputElement>) => {
    setIsDragEnter(false);
  };

  return (
    <FABContainer>
      <input
        ref={inputFile}
        type="file"
        multiple={true}
        accept="image/*"
        onChange={onChange}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragEnd={onDragLeave}
        onDragExit={onDragLeave}
      />
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
    svg {
      margin: 0;
    }
  }
`;
