import { ComponentType, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon, Text } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import { usePageSettingContext } from '@app/context';

type TitleConfig = {
  header?: string;
  backLink?: string;
};

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: calc(var(--prop-gap) / 4);
`;

export const withPageTitle =
  ({ header, backLink }: TitleConfig) =>
  <P,>(Page: ComponentType<P>) =>
  (props: P) => {
    const { currentChain } = useApi();
    const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();

    useEffect(() => {
      const link = (
        <BackLink to={`/${currentChain?.network}/${backLink}`}>
          <Icon color="var(--color-blue-grey-500)" name="arrow-left" size={16} />
          <Text color="blue-grey-500" weight="light">
            back
          </Text>
        </BackLink>
      );
      const options = backLink ? [link] : [];

      setPageBreadcrumbs({
        options,
      });
      setPageHeading(header);
    }, []);

    return <Page {...props} />;
  };
