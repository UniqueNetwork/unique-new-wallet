import React, { FC } from 'react';
import { Heading } from '@unique-nft/ui-kit';
import { PagePaper } from '../../components/PagePaper/PagePaper';

export const Error404: FC = () => {
  return (
    <PagePaper>
      <Heading size={'1'} >Not found</Heading>
    </PagePaper>
  );
};
