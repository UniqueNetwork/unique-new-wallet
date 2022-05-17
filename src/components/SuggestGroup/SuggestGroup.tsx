import { Suggest } from '@unique-nft/ui-kit';
import { SuggestProps } from '@unique-nft/ui-kit/dist/cjs/components/Suggest/Suggest';

import { SuggestWrapper } from '@app/components/SuggestGroup/components/SuggestWrapper';
import { SuggestItem } from '@app/components/SuggestGroup/components/SuggestItem';

// TODO: add suggestion component className prop for styled component
import './SuggestGroup.scss';

export type SuggestGroupProps<T> = Omit<SuggestProps<T>, 'components'>;

export const testSuggestValues = [
  {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    group: 1,
  },
  {
    userId: 1,
    id: 2,
    title: 'qui est esse',
    group: 2,
  },
  {
    userId: 1,
    id: 3,
    title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
    group: 1,
  },
  {
    userId: 1,
    id: 4,
    title: 'quasi exercitationem repellat qui ipsa sit aut',
    group: 2,
  },
];

export type TestSuggestValues = typeof testSuggestValues[number];

export const SuggestGroup = (props: SuggestGroupProps<TestSuggestValues>) => (
  <Suggest components={{ SuggestWrapper, SuggestItem }} {...props} />
);
