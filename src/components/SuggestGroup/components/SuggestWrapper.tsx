import styled from 'styled-components/macro';

import { TestSuggestValues } from '@app/components/SuggestGroup/SuggestGroup';
import { SuggestWrapperProps } from '@app/components';

export const SuggestWrapper = ({
  suggestions,
  children,
}: SuggestWrapperProps<TestSuggestValues>) => {
  const group1 = suggestions.filter((value) => value.group === 1);
  const group2 = suggestions.filter((value) => value.group === 2);
  return (
    <>
      {group1.length > 0 && (
        <GroupNft>
          <Title>NFTs</Title>
          <div>{children(group1)}</div>
          <Link href="#">View all results</Link>
        </GroupNft>
      )}
      {group2.length > 0 && (
        <GroupCollections>
          <Title>Collections</Title>
          <div>{children(group2)}</div>
          <Link href="#">View all results</Link>
        </GroupCollections>
      )}
    </>
  );
};

const GroupNft = styled.div`
  border-bottom: 1px dashed var(--color-grey-300);
  padding-bottom: 10px;
`;

const GroupCollections = styled.div`
  padding-bottom: 10px;
`;

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
