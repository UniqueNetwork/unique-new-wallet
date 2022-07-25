import { createContext, useContext } from 'react';
import { BreadcrumbsProps } from '@unique-nft/ui-kit';

interface PageSettingContextState {
  breadcrumbs?: BreadcrumbsProps;
  heading?: string;
  setPageHeading: (heading: string) => void;
  setPageBreadcrumbs: (breadcrumbs: BreadcrumbsProps) => void;
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
