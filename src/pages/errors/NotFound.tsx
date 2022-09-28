import { ErrorPage, PagePaper } from '@app/components';

export const NotFound = () => {
  return (
    <PagePaper flexLayout="row">
      <ErrorPage />
    </PagePaper>
  );
};
