import { ComponentProps } from '@unique-nft/ui-kit';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Icon } from '../Icon';

export interface IUploadBaseProps {
  onChange?: (data: { url: string; file: Blob } | null) => void;
  type?: 'circle' | 'square';
  accept?: string;
  upload?: string;
  beforeUpload?: (data: { url: string; file: Blob }) => boolean;
}

export type UploadProps = IUploadBaseProps &
  Pick<ComponentProps, 'className' | 'disabled' | 'testid'>;

export const Upload = React.memo(
  ({
    onChange,
    className,
    type = 'circle',
    accept = 'image/*',
    disabled = false,
    upload,
    testid,
    beforeUpload,
  }: UploadProps) => {
    const inputFile = useRef<HTMLInputElement>(null);
    const [objectUrl, setObjectUrl] = useState<string | undefined>();

    const onValidate = (file: Blob | undefined) => {
      if (!file) {
        return true;
      }
      const url = URL.createObjectURL(file);
      return beforeUpload ? beforeUpload({ url, file }) : true;
    };

    const onChangeFile = (file: Blob | undefined) => {
      if (!inputFile.current) {
        return;
      }
      if (!file) {
        setObjectUrl(undefined);
        onChange?.(null);
        inputFile.current.value = '';
        return;
      }
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      onChange?.({ url, file });
    };

    useEffect(() => {
      setObjectUrl(upload);
      if (!upload && inputFile.current) {
        inputFile.current.value = '';
      }
    }, [upload]);

    useEffect(
      () => () => {
        objectUrl && URL.revokeObjectURL(objectUrl);
      },
      [objectUrl],
    );

    return (
      <UploadWrapper className={classNames('unique-upload', className)}>
        {objectUrl ? (
          <div className={classNames('preview', type)}>
            <div
              className="image"
              style={{
                backgroundImage: `url(${objectUrl})`,
              }}
            />
            <span
              onClick={() => {
                onChangeFile(undefined);
              }}
            >
              <Icon name="close-circle" size={13} />
            </span>
          </div>
        ) : (
          <div
            className={classNames('upload', type, { disabled })}
            onClick={() => {
              inputFile.current?.click();
            }}
            onDragOver={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onDrop={(event) => {
              onChangeFile(event.dataTransfer.files[0]);
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <Icon name="file-arrow-up" size={38} />
          </div>
        )}
        <input
          ref={inputFile}
          type="file"
          disabled={disabled}
          accept={accept}
          data-testid={testid}
          onChange={(e) => {
            if (!e.target.files || e.target.files.length === 0) {
              onChangeFile(undefined);
              return;
            }
            const file = e.target.files[0];
            if (onValidate(file)) {
              onChangeFile(e.target.files[0]);
            } else {
              if (!inputFile.current) {
                return;
              }
              inputFile.current.value = '';
            }
          }}
        />
      </UploadWrapper>
    );
  },
);

const UploadWrapper = styled.div`
  input[type='file'] {
    display: none;
  }
  .upload,
  .preview {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-additional-light);
    border: 1px dashed var(--color-primary-500);
    cursor: pointer;
    &.circle .image,
    &.square .image {
      object-fit: contain;
      background-size: cover;
    }
    &.circle {
      width: 118px;
      height: 118px;
      border-radius: 100px;
      .image {
        border-radius: 100px;
        height: 102px;
        width: 102px;
      }
    }
    &.square {
      width: 176px;
      height: 176px;
      border-radius: var(--prop-border-radius);
      .image {
        border-radius: var(--prop-border-radius);
        height: 160px;
        width: 160px;
      }
    }
    &:hover {
      background-color: var(--color-primary-100);
    }
    &.disabled {
      cursor: not-allowed;
      border-color: var(--color-blue-grey-300);
      svg {
        fill: var(--color-blue-grey-300);
      }
      &:hover {
        background-color: unset;
      }
    }
  }
  .upload {
    .icon {
      fill: var(--color-primary-500);
    }
  }
  .preview {
    .icon {
      position: absolute;
      top: 0;
      right: -21px;
      fill: var(--color-blue-grey-400);
    }
  }
`;
