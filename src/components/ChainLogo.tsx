import React, { useMemo } from 'react';

import { useApi } from '@app/hooks';

import { chainLogos, emptyLogos, namedLogos, nodeLogos } from '../logos';

interface Props {
  className?: string;
  isInline?: boolean;
  logo?: keyof typeof namedLogos;
  onClick?: () => any;
  withoutHl?: boolean;
  size?: number;
}

function sanitize(value?: string): string {
  return value?.toLowerCase().replace('-', ' ') || '';
}

function ChainLogo({
  className = '',
  isInline,
  logo,
  onClick,
  withoutHl,
  size = 32,
}: Props): React.ReactElement<Props> {
  // const { chainData } = useApi();

  const [isEmpty, img] = useMemo((): [boolean, string] => {
    const found = logo
      ? namedLogos[logo]
      : ''; /* chainLogos[sanitize(chainData?.systemChain)] ||
        nodeLogos[sanitize(chainData?.systemName)]; */

    return [!found || logo === 'empty', (found || emptyLogos.empty) as string];
  }, [logo]);

  return (
    <img
      alt="chain logo"
      className={`chain-logo ${className}${
        isEmpty && !withoutHl ? ' highlight--bg' : ''
      }${isInline ? ' isInline' : ''}`}
      src={img}
      height={size}
      onClick={onClick}
    />
  );
}

export default React.memo(ChainLogo);
