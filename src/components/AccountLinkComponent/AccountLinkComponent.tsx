import React, { VFC } from 'react';
import { useParams } from 'react-router-dom';

import { ExternalLink, Typography } from '@app/components';
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
    <ExternalLink href={`${currentChain.uniquescanAddress}/account/${value}`}>
      <Typography color="primary-600" size={size}>
        {shortcut}
      </Typography>
    </ExternalLink>
  );
};

export default AccountLinkComponent;
