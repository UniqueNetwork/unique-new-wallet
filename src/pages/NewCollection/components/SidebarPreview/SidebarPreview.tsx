import './styles.scss';
import { ReactNode } from 'react';

export type CollectionPreview = {
  title: string;
  description: string;
  srcImg?: string;
  children?: ReactNode;
};

export const SidebarPreview = ({
  srcImg,
  title,
  description,
  children
}: CollectionPreview) => {
  return (
    <div>
      <div className={'collection-preview'}>
        <div className={'preview-avatar'}>
          <img src={srcImg} alt='preview-image' />
        </div>
        <div className={'preview-content'}>
          <div className='title'>{title}</div>
          <div className='description'>{description}</div>
          {children}
        </div>
      </div>
    </div>
  );
};
