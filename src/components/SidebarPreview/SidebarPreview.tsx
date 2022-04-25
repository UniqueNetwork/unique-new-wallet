import { ReactNode } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

export type CollectionPreview = {
  className?: string;
  title: string;
  description: string;
  srcImg?: string;
  children?: ReactNode;
};

const SidebarPreviewComponent = ({
  className,
  srcImg,
  title,
  description,
  children
}: CollectionPreview) => {
  return (
    <div className={classNames('collection-preview', className)}>
      <div className='preview-avatar'>
        <img src={srcImg} alt='preview-image' />
      </div>
      <div className='preview-content'>
        <div className='title'>{title}</div>
        <div className='description'>{description}</div>
        {children}
      </div>
    </div>
  );
};

export const SidebarPreview = styled(SidebarPreviewComponent)`
  display: flex;
  align-items: center;

  .preview-avatar {
    margin-right: 15px;
  }

  .title {
    color: #040b1d;
    font-weight: var(--font-medium);
    font-size: 18px;
    margin-bottom: 5px;
  }
  .description {
    color: #81858e;
  }
  .preview-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #f5f6f7;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
