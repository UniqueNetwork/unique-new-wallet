import { Heading } from '@unique-nft/ui-kit';
import styled from 'styled-components';
import classNames from 'classnames';
import { SidebarPreview } from '@app/components';
import { MainInformationInitialValues } from '@app/types';

import srcImg from '@app/static/icons/empty-image.svg';
import './styles.scss';

const attributes = ['Name', 'Gender', 'Traits'];

type Props = {
  className?: string;
  mainInformationValue: MainInformationInitialValues;
};

const CollectionSidebarComponent = ({ className, mainInformationValue }: Props) => {
  const { name, description, tokenPrefix } = mainInformationValue;
  return (
    <div className={classNames('collection-sidebar', className)}>
      <div>
        <Heading size={'3'}>Collection preview</Heading>
        <SidebarPreview
          srcImg={srcImg}
          description={description || 'Description'}
          title={name || 'Name'}
        />
      </div>
      <div className={'nft-preview-sidebar'}>
        <Heading size={'3'}>NFT preview</Heading>
        <SidebarPreview
          srcImg={srcImg}
          description={'Collection name'}
          title={tokenPrefix || 'tokenPrefix'}
        >
          <div className='attributes'>
            <div className='title'>Attribute names</div>
            {attributes && (
              <span className={'attributes-content'}>
                {attributes.join(', ')}
              </span>
            )}
          </div>
        </SidebarPreview>
      </div>
    </div>
  );
};

export const CollectionSidebar = styled(CollectionSidebarComponent)`
  margin-top: 40px;

  .attributes {
    margin-top: 15px;
  }
`;
