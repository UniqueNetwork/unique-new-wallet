import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import { Icon, Text } from '@unique-nft/ui-kit';

interface UploadProps {
  onChange(file: File): void;
}

// todo - use from ui-kit
export const Upload: FC<UploadProps> = ({ onChange }) => {
  const [fileName, setFileName] = useState<string>();
  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target?.files && event.target?.files.length) {
        onChange(event.target.files[0]);
        setFileName(event.target.files[0].name);
      }
    },
    [onChange],
  );

  return (
    <UploadWrapper>
      <input type={'file'} accept={'.json'} onChange={onInputChange} />
      <Icon name={'upload'} size={48} />
      {fileName && <Text color={'primary-500'}>{fileName}</Text>}
    </UploadWrapper>
  );
};

const UploadWrapper = styled.div`
  position: relative;
  background: var(--color-additional-light);
  padding: 52px 0;
  border: 1px dashed var(--color-primary-500);
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
`;
