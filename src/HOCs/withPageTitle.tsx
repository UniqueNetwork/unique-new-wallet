import { ComponentType, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { usePageSettingContext } from '@app/context';

type TitleConfig = {
  header?: string;
  backLink?: string;
  backByHistory?: boolean;
};

export const withPageTitle =
  ({ header, backLink }: TitleConfig) =>
  <P,>(Page: ComponentType<P>) =>
  (props: P) => {
    const { setBackLink, setPageHeading } = usePageSettingContext();
    const state = useLocation().state as null | { backLink: string };

    useEffect(() => {
      setBackLink(state?.backLink || backLink || null);
      setPageHeading(header);
    }, [header, state?.backLink, backLink]);

    return <Page {...props} />;
  };
