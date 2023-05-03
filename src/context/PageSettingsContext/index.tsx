import { FC, ReactNode, useMemo, useState } from 'react';

import { PageSettingsContext } from '@app/context';
import { BreadcrumbsProps } from '@app/components';

export const PageSettingsWrapper: FC = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsProps>();
  const [heading, setHeading] = useState<string | null>();
  const [backLink, setBackLink] = useState<string | null>();

  const setPageBreadcrumbs = (breadcrumbs: any) => {
    setBreadcrumbs(breadcrumbs);
  };

  const setPageHeading = (heading?: string | null) => {
    setHeading(heading);
  };

  const value = useMemo(
    () => ({
      breadcrumbs,
      heading,
      backLink,
      setPageBreadcrumbs,
      setPageHeading,
      setBackLink,
    }),
    [breadcrumbs, heading, backLink],
  );

  return (
    <PageSettingsContext.Provider value={value}>{children}</PageSettingsContext.Provider>
  );
};

export * from './PageSettingContext';
