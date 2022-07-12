import { ButtonProps } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import { BaseActionBtn } from '@app/components/ActionBtn/BaseActionBtn';

export const BurnBtn = (props: ButtonProps) => {
  const { currentChain } = useApi();
  return (
    <BaseActionBtn
      {...props}
      actionEnabled={currentChain.burnEnabled}
      actionText="Burn NFT temporary unavailable due to a chain upgrade"
    />
  );
};
