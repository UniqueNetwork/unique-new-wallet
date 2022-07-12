import { ButtonProps } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import { BaseActionBtn } from '@app/components/ActionBtn/BaseActionBtn';

export const MintingBtn = (props: ButtonProps) => {
  const { currentChain } = useApi();
  return (
    <BaseActionBtn
      {...props}
      actionEnabled={currentChain.mintingEnabled}
      actionText="Minting temporary unavailable due to a chain upgrade"
    />
  );
};
