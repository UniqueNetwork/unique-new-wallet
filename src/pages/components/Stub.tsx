import { FC, useContext } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import { Icon, PagePaper, Typography, Link as UILink } from '@app/components';
import { ConnectWalletModalContext } from '@app/context';
import { ROUTE } from '@app/routes';
import { useApi } from '@app/hooks';

const Stub: FC = () => {
  const { setIsOpenConnectWalletModal } = useContext(ConnectWalletModalContext);
  const { currentChain } = useApi();

  const onConnectWalletClick = () => setIsOpenConnectWalletModal(true);

  return (
    <PagePaper noPadding flexLayout="column">
      <StubWrapper>
        <Icon name="no-accounts" size={80} />
        <Typography color="blue-grey-500" size="m" weight="light">
          Nothing to display.
        </Typography>
        <Typography color="blue-grey-500" size="m" weight="light">
          Please{' '}
          <UILink role="primary" size="medium" onClick={onConnectWalletClick}>
            connect your wallet
          </UILink>{' '}
          or visit the <Link to={`/${currentChain?.network}/${ROUTE.FAQ}`}>FAQ</Link> to
          learn more.
        </Typography>
      </StubWrapper>
    </PagePaper>
  );
};

const StubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  svg {
    margin-bottom: var(--prop-gap);
  }
`;

export default Stub;
