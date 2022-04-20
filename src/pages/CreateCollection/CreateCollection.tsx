import { FC } from 'react';
import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

interface CreateCollectionProps {
  className?: string;
}

export const CreateCollection: FC<CreateCollectionProps> = (props) => {
  const { className } = props;

  return (
    <div className={classNames('create-collection', className)}>
      Create collection

      <Outlet />
    </div>
  );
};

export default CreateCollection;