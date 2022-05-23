import React, { VFC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Text } from '@unique-nft/ui-kit';

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
    <Link to={`/${currentChain?.network}/account/${value}`}>
      <Text color={'primary-600'} size={size}>
        {shortcut}
      </Text>
    </Link>
  );
};

export default AccountLinkComponent;
