import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';

import { FILE_FORMAT_ERROR } from '@app/pages';
import { DeviceSize, useDeviceSize } from '@app/hooks';
import { shortcutText } from '@app/utils';

import { Icon, Typography, useNotifications } from '..';

interface UploadProps {
  onChange(file: File): void;
}

export const UploadJson: FC<UploadProps> = ({ onChange }) => {
  const [fileName, setFileName] = useState<string>();
  const deviceSize = useDeviceSize();
  const { error } = useNotifications();
  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target?.files && event.target?.files.length) {
        if (!/.+\.json$/.test(event.target.files[0].name)) {
          error(FILE_FORMAT_ERROR);
          return;
        }
        onChange(event.target.files[0]);
        setFileName(event.target.files[0].name);
      }
    },
    [onChange],
  );

  return (
    <UploadWrapper>
      <input type="file" accept=".json" onChange={onInputChange} />
      <Icon name="upload" size={48} />
      {fileName && (
        <Typography color="primary-500">
          {deviceSize < DeviceSize.sm ? shortcutText(fileName, [5, 10]) : fileName}
        </Typography>
      )}
    </UploadWrapper>
  );
};

const UploadWrapper = styled.div`
  position: relative;
  background: var(--color-additional-light);
  padding: 16px 0;
  border: 1px dashed var(--color-primary-500);
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  span.unique-text {
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
  }
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
