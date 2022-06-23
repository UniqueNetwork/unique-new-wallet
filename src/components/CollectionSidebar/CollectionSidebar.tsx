import { Heading } from '@unique-nft/ui-kit';
import styled from 'styled-components';
import classNames from 'classnames';
import { useContext } from 'react';

import { SidebarPreview } from '@app/components';
import srcImg from '@app/static/icons/empty-image.svg';
import { CollectionFormContext } from '@app/context';

const attributes = ['Name', 'Gender', 'Traits'];

type Props = {
  className?: string;
};

const CollectionSidebarComponent = ({ className }: Props) => {
  const { coverImgFile, mainInformationForm } = useContext(CollectionFormContext);
  const { values } = mainInformationForm;
  const { name, description, tokenPrefix } = values;

  return (
    <div className={classNames('collection-sidebar', className)}>
      <Item className="collection-preview">
        <Heading size="3">Collection preview</Heading>
        <SidebarPreview
          srcImg={coverImgFile ? URL.createObjectURL(coverImgFile) : srcImg}
          description={description || 'Description'}
          title={name || 'Name'}
        />
      </Item>
      <Item className="nft-preview">
        <Heading size="3">NFT preview</Heading>
        <SidebarPreview
          srcImg={srcImg}
          description="Collection name"
          title={tokenPrefix || 'tokenPrefix'}
        >
          <AttributeName>
            <div className="attribute-title">Attribute names</div>
            {attributes && (
              <span className="attributes-content">{attributes.join(', ')}</span>
            )}
          </AttributeName>
        </SidebarPreview>
      </Item>
    </div>
  );
};

export const CollectionSidebar = styled(CollectionSidebarComponent)`
  .nft-preview-sidebar {
    margin-top: 40px;

    .attributes {
      margin-top: 15px;
    }
  }
`;

const Item = styled.div`
  & + div {
    margin-top: 40px;
  }
`;

const AttributeName = styled.div`
  margin-top: 15px;

  .attribute-title {
    font-size: 16px;
  }
`;
