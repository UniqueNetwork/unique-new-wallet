import { Heading } from '@unique-nft/ui-kit';
import { SidebarPreview } from '../SidebarPreview';
import srcImg from '../../../../static/icons/empty-image.svg';
import './styles.scss';
import { MainInformationValues } from '../../NewCollection';

const attributes = ['Name', 'Gender', 'Traits'];

type Props = {
  mainInformationValue: MainInformationValues;
};

export const CollectionSidebar = ({ mainInformationValue }: Props) => {
  const { name, description, symbol } = mainInformationValue;
  return (
    <>
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
          description={'Сollection name'}
          title={symbol || 'Symbol'}
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
    </>
  );
};
