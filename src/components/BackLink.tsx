import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useApi } from '@app/hooks';

import { Icon } from './Icon';
import { Typography } from './Typography';

export const BackLink = ({ link }: { link: string | undefined }) => {
  const { currentChain } = useApi();
  return (
    <StyledLink
      to={
        link?.startsWith(`/${currentChain?.network}`)
          ? link
          : `/${currentChain?.network}/${link}`
      }
    >
      <Icon color="var(--color-blue-grey-500)" name="arrow-left" size={16} />
      <Typography color="blue-grey-500" weight="light">
        back
      </Typography>
    </StyledLink>
  );
};

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: calc(var(--prop-gap) / 4);
  margin-bottom: calc(var(--prop-gap) * 2);
  width: fit-content;
`;
