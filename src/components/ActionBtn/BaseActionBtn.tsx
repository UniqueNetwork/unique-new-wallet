import { Button, Text, ButtonProps, IconProps } from '@unique-nft/ui-kit';

import { Tooltip } from '../Tooltip';

export const BaseActionBtn = ({
  actionEnabled,
  actionText,
  tooltip,
  ...props
}: ButtonProps & {
  actionEnabled: boolean;
  actionText: string;
  tooltip?: string | null;
}) => {
  const iconRender = (icon?: IconProps) => {
    return icon ? { ...icon, color: 'var(--color-blue-grey-300)' } : undefined;
  };

  return actionEnabled ? (
    <>
      {!tooltip ? (
        <Button {...props} />
      ) : (
        <Tooltip title={<Text color="#fff">{tooltip}</Text>}>
          <Button {...props} />
        </Tooltip>
      )}
    </>
  ) : (
    <Tooltip title={<Text color="#fff">{actionText}</Text>}>
      <Button
        className={props.className}
        title={props.title}
        role={props.role}
        iconLeft={iconRender(props.iconLeft)}
        iconRight={iconRender(props.iconRight)}
        disabled={true}
      />
    </Tooltip>
  );
};
