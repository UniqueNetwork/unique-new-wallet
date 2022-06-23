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
  children,
}: CollectionPreview) => {
  return (
    <div className={classNames('collection-preview', className)}>
      <div className="preview-avatar">
        <img src={srcImg} alt="preview-image" />
      </div>
      <div className="preview-content">
        <div className="title">{title}</div>
        <div className="description">{description}</div>
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
    color: var(--color-secondary-500);
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 5px;
  }

  .description {
    color: var(--color-grey-500);
  }

  .preview-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--color-blue-grey-100);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
    }
  }
`;
