import { FC, useMemo, useState } from 'react';
import { BreadcrumbsProps } from '@unique-nft/ui-kit';

import { PageSettingsContext } from '@app/context';

export const PageSettingsWrapper: FC = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsProps>();
  const [heading, setHeading] = useState<string | null>();

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
      setPageBreadcrumbs,
      setPageHeading,
    }),
    [breadcrumbs, heading],
  );

  return (
    <PageSettingsContext.Provider value={value}>{children}</PageSettingsContext.Provider>
  );
};

export * from './PageSettingContext';
