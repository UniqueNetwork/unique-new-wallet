import { FC } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import { Typography } from '@app/components';
import { ROUTE } from '@app/routes';
import { useApi } from '@app/hooks';

export const NothingToDisplay: FC = () => {
  const { currentChain } = useApi();
  return (
    <StubWrapper>
      <Typography color="blue-grey-500" size="m" weight="light">
        Nothing to display.
      </Typography>
      <Typography color="blue-grey-500" size="m" weight="light">
        Visit the <Link to={`/${currentChain?.network}/${ROUTE.FAQ}`}>FAQ</Link> to learn
        more about the minting process.
      </Typography>
    </StubWrapper>
  );
};

const StubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`;
