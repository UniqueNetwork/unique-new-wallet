import { memo, useMemo } from 'react';
import styled from 'styled-components';

import { Icon, Tag, Tags, TooltipWrapper, Heading, Typography } from '@app/components';
import { TBaseToken } from '@app/pages/TokenDetails/type';
import { DEFAULT_POSITION_TOOLTIP } from '@app/pages';

export type Attribute = {
  title: string;
  tags: string[];
};

interface TokenInformationProps<T extends TBaseToken> {
  token?: T;
  className?: string;
}

const TokenInformationComponent = <T extends TBaseToken>({
  token,
  className,
}: TokenInformationProps<T>) => {
  const attributes = useMemo<Attribute[]>(() => {
    if (!token) {
      return [];
    }

    const attrsValues = Object.values(token?.attributes || {});

    return attrsValues.map(({ name, value }) => ({
      title: name._,
      tags: Array.isArray(value) ? value.map((val) => val._) : [value._],
    }));
  }, [token?.attributes]);

  return (
    <div className={className}>
      <Heading className="attributes-header" size="4">
        Attributes
        <TooltipWrapper
          align={DEFAULT_POSITION_TOOLTIP}
          message={
            <>
              Special features of&nbsp;the token that the collection creator specifies
              when minting
            </>
          }
        >
          <Icon name="question" size={24} color="var(--color-primary-500)" />
        </TooltipWrapper>
      </Heading>
      {(!attributes || !attributes.length) && (
        <Typography color="blue-grey-500">
          There are no attributes for this token
        </Typography>
      )}
      {attributes?.map(({ title, tags }, index) => (
        <div className="attribute-row" key={`${title}${index}`}>
          <Typography
            appearance="block"
            className="attribute-title"
            size="m"
            weight="light"
            color="grey-500"
          >
            {title}
          </Typography>
          <Tags>
            {tags.map((value, index) => (
              <Tag key={`${value}-${index}`} label={value} />
            ))}
          </Tags>
        </div>
      ))}
    </div>
  );
};

const TokenInformationStyled = styled(TokenInformationComponent)`
  .attributes-header,
  .attribute-row {
    margin-bottom: var(--prop-gap);
    word-break: break-all;
  }

  .attributes-header {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  .attribute-title {
    margin-bottom: calc(var(--prop-gap) / 2);
  }
`;

export const TokenInformation = memo(TokenInformationStyled);
