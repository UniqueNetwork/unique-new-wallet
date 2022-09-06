import { ErrorPage, PagePaper } from '@app/components';

export const NotFound = () => {
  return (
    <PagePaper noPadding flexLayout="row">
      <ErrorPage />
    </PagePaper>
  );
};
