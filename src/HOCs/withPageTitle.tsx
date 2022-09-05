/* eslint-disable react/display-name */
import React, { ComponentType, useEffect } from 'react';

import { usePageSettingContext } from '@app/context';

type TitleConfig = {
  header?: string;
  backLink?: string;
};

export const withPageTitle =
  ({ header, backLink }: TitleConfig) =>
  <P,>(Page: ComponentType<P>) =>
  (props: P) => {
    const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();

    useEffect(() => {
      const options = backLink
        ? [
            {
              title: '🡠 back',
              link: backLink,
            },
          ]
        : [];

      setPageBreadcrumbs({
        options,
      });
      setPageHeading(header);
    }, []);

    return <Page {...props} />;
  };
