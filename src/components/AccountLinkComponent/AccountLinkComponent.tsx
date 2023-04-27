import React, { VFC } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Typography } from '@app/components';
import { shortcutText } from '@app/utils';
import { useApi } from '@app/hooks';

interface AccountLinkProps {
  value: string;
  size?: 'xs' | 's' | 'm' | 'l';
  noShort?: boolean;
}

export const AccountLinkComponent: VFC<AccountLinkProps> = ({
  noShort,
  size = 'm',
  value,
}) => {
  const { accountId } = useParams();
  const { currentChain } = useApi();

  const shortcut = noShort ? value : shortcutText(value);

  if (value === accountId) {
    return <>{shortcut}</>;
  }

  return (
    <Link to={`${currentChain.uniquescanAddress}/account/${value}`}>
      <Typography color="primary-600" size={size}>
        {shortcut}
      </Typography>
    </Link>
  );
};

export default AccountLinkComponent;
