import { Icon, InputText, InputTextProps, TooltipWrapper } from '@app/components';
import { DeviceSize, useDeviceSize } from '@app/hooks';
import { DEFAULT_POSITION_TOOLTIP } from '@app/pages';

export const InputTransfer = (inputProps: InputTextProps) => {
  const deviceSize = useDeviceSize();
  return (
    <InputText
      clearable
      label={
        <>
          Recipient address
          <TooltipWrapper
            align={
              deviceSize < DeviceSize.md
                ? { appearance: 'vertical', horizontal: 'middle', vertical: 'top' }
                : DEFAULT_POSITION_TOOLTIP
            }
            message={
              <>
                Make sure to&nbsp;use a&nbsp;Substrate address created with
                a&nbsp;Polkadot.&#123;js&#125; wallet. There is&nbsp;no&nbsp;guarantee
                that third-party wallets, exchanges or&nbsp;hardware wallets can
                successfully sign and process your transfer which will result
                in&nbsp;a&nbsp;possible loss of&nbsp;the NFT.
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
};
