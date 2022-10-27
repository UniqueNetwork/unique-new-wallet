import { Icon, InputText, InputTextProps } from '@unique-nft/ui-kit';

import { TooltipWrapper } from '@app/components';

const ALIGN = {
  appearance: 'horizontal',
  horizontal: 'right',
  vertical: 'top',
} as const;

export const InputTransfer = (inputProps: InputTextProps) => (
  <InputText
    label={
      <>
        Recipient address
        <TooltipWrapper
          align={ALIGN}
          message={
            <>
              Make sure to&nbsp;use a&nbsp;Substrate address created with
              a&nbsp;Polkadot.&#123;js&#125; wallet. There is&nbsp;no&nbsp;guarantee that
              third-party wallets, exchanges or&nbsp;hardware wallets can successfully
              sign and process your transfer which will result in&nbsp;a&nbsp;possible
              loss of&nbsp;the NFT.
            </>
          }
        >
          <Icon color="var(--color-primary-500)" name="question" size={24} />
        </TooltipWrapper>
      </>
    }
    maxLength={49}
    {...inputProps}
  />
);