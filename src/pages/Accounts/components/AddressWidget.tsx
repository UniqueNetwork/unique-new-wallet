import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import { shortAddress } from '@app/utils';
import { DeviceSize, useDeviceSize } from '@app/hooks';
import { IdentityIcon, Typography } from '@app/components';

interface AddressWidgetProps {
  address?: string;
  empty?: boolean;
}

export const AddressWidget = ({ address = '', empty }: AddressWidgetProps) => {
  const deviceSize = useDeviceSize();

  return (
    <Wrapper className={classNames({ _empty: empty })}>
      {!empty && <IdentityIcon address={address} />}
      <AddressText>
        {empty
          ? 'The account address will appear while entering the secret seed value'
          : deviceSize >= DeviceSize.md
          ? address
          : shortAddress(address)}
      </AddressText>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 1px solid var(--color-grey-300);
  border-radius: var(--prop-border-radius);
  display: flex;
  column-gap: calc(var(--prop-gap) / 2);
  min-height: 24px;
  padding: 20px var(--prop-gap);

  &._empty {
    color: var(--color-grey-400);
  }
`;

export const AddressText = styled(Typography).attrs({
  appearance: 'block',
  size: 's',
})`
  &.unique-text {
    color: inherit;
    line-height: 22px;
  }
`;
