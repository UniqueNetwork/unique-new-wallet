import { SuggestWrapperProps } from '@unique-nft/ui-kit/dist/cjs/components/Suggest/components';
import styled from 'styled-components/macro';

import { TestSuggestValues } from '@app/components/SuggestGroup/SuggestGroup';

export const SuggestWrapper = ({
  suggestions,
  children,
}: SuggestWrapperProps<TestSuggestValues>) => {
  const group1 = suggestions.filter((value) => value.group === 1);
  const group2 = suggestions.filter((value) => value.group === 2);
  return (
    <>
      {group1.length > 0 && (
        <div
          style={{
            borderBottom: '1px dashed var(--color-grey-300)',
            paddingBottom: '10px',
          }}
        >
          <Title>NFTs</Title>
          <div>{children(group1)}</div>
          <Link href={'#'}>View all results</Link>
        </div>
      )}
      {group2.length > 0 && (
        <div style={{ paddingBottom: '10px' }}>
          <Title>Collections</Title>
          <div>{children(group2)}</div>
          <Link href={'#'}>View all results</Link>
        </div>
      )}
    </>
  );
};

const Title = styled.p`
  padding: 8px;
  color: var(--color-grey-500);
`;

const Link = styled.a`
  color: var(--color-primary-500);
  margin: 5px 8px;
  display: inline-block;
  text-decoration: none;
`;
