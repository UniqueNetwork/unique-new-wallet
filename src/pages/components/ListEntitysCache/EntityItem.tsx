import styled from 'styled-components';

import { Avatar } from '@app/components';
import { getTokenIpfsUriByImagePath } from '@app/utils';

import { TResultEntityCache } from './ListEntitiesCache';

export const EntityItem = ({ path }: TResultEntityCache) => {
  return (
    <EntityItemStyle>
      <Avatar src={getTokenIpfsUriByImagePath(path)} size={96} fit="fill" />
    </EntityItemStyle>
  );
};

const EntityItemStyle = styled.div`
  width: 96px;
  height: 96px;
  overflow: hidden;
  border-radius: var(--prop-border-radius);

  img {
    max-width: 100%;
    height: 100%;
  }
`;
