import { FC, useEffect } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heading } from '@unique-nft/ui-kit';

import { CollectionSidebar } from '@app/components';

interface CreateCollectionProps {
  className?: string;
}

const CreateCollectionComponent: FC<CreateCollectionProps> = (props) => {
  const { className } = props;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/create-collection') {
      navigate('/create-collection/main-information/');
    }
  }, [location.pathname, navigate]);

  return (
    <div className={classNames('create-collection', className)}>
      <Heading size="1">Create a collection</Heading>
      <div className="collection-template">
        <div className="collection-content-page">
          <div className="collection-content">
            <Outlet />
          </div>
        </div>
        <CollectionSidebar />
      </div>
    </div>
  );
};

export const CreateCollection = styled(CreateCollectionComponent)`
  .collection-content-page {
    margin-right: 30px;
    width: 100%;
  }

  .collection-template {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    .unique-input-text,
    .unique-textarea-text {
      width: 100%;
    }
  }

  .collection-sidebar {
    max-width: 600px;
    width: 100%;
  }

  .collection-heading {
    display: flex;
    flex-direction: column;
    row-gap: calc(var(--prop-gap) / 2);
    margin-top: calc(var(--prop-gap) * 2);
    .unique-font-heading {
      margin-bottom: 0;
    }
  }

  .collection-content {
    max-width: 756px;
    display: flex;
    flex-direction: column;
    row-gap: calc(var(--prop-gap) * 2);
    margin: calc(var(--prop-gap) * 1.5) 0;
    .collection-upload-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: var(--prop-gap);
      .collection-upload-title {
        display: flex;
        flex-direction: column;
        row-gap: calc(var(--prop-gap) / 4);
      }
    }
  }

  .collection-content-page,
  .collection-sidebar {
    box-sizing: border-box;
    background: var(--color-additional-light);
    padding: calc(var(--prop-gap) * 2);
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
    border-radius: calc(var(--prop-gap) / 4);
  }
`;
