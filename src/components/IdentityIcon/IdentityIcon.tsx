import { VFC } from 'react';
import styled from 'styled-components';
// @ts-ignore
import Jdenticon from 'react-jdenticon';
import { useNotifications } from '@unique-nft/ui-kit';

interface IdentityIconProps {
  address: string;
  className?: string;
  isCopyable?: boolean;
  size?: string;
}

const Wrapper = styled.div<{ isCopyable?: boolean }>`
  cursor: ${(p) => (p.isCopyable ? 'pointer' : 'auto')};

  svg {
    display: block;
  }
`;

const Address = styled.p`
  word-break: break-all;
`;

export const IdentityIcon: VFC<IdentityIconProps> = ({
  address = '',
  className,
  isCopyable,
  size = '24',
}) => {
  const { info } = useNotifications();

  const handleAddressCopy = () => {
    if (!isCopyable) {
      return;
    }

    navigator.clipboard.writeText(address);

    info(
      <Address>
        Address <i>{address}</i>
        <br />
        successfully copied
      </Address>,
    );
  };

  return (
    <Wrapper className={className} isCopyable={isCopyable} onClick={handleAddressCopy}>
      <Jdenticon size={size} value={address} />
    </Wrapper>
  );
};
