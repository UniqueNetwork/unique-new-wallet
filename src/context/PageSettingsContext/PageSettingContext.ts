import { createContext, useContext } from 'react';

import { BreadcrumbsProps } from '@app/components';

interface PageSettingContextState {
  breadcrumbs?: BreadcrumbsProps;
  heading?: string | null;
  backLink?: string | null;
  setPageHeading: (heading?: string | null) => void;
  setPageBreadcrumbs: (breadcrumbs: BreadcrumbsProps) => void;
  setBackLink: (backLink: string | null) => void;
}

export const PageSettingsContext = createContext<PageSettingContextState | null>(null);

export const usePageSettingContext = () => {
  const context = useContext(PageSettingsContext);

  if (!context) {
    throw new Error(
      'PageSetting context value was not provided. Make sure PageSetting context exists!',
    );
  }

  return context;
};
