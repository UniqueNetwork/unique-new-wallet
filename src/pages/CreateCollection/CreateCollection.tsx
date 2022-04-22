import { FC, useEffect } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface CreateCollectionProps {
  className?: string;
}

const CreateCollectionComponent: FC<CreateCollectionProps> = (props) => {
  const { className } = props;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/create-collection') {
      navigate('main-information');
    }
  }, []);

  return (
    <div className={classNames('create-collection', className)}>
      <Outlet />
    </div>
  );
};

export const CreateCollection = styled(CreateCollectionComponent)`
`;