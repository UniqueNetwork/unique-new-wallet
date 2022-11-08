import { Button, ButtonProps, IconProps, TooltipWrapper } from '@app/components';

export const BaseActionBtn = ({
  actionEnabled,
  actionText,
  ...props
}: ButtonProps & {
  actionEnabled: boolean;
  actionText: string;
  tooltip?: string | null;
}) => {
  const iconRender = (icon?: IconProps) => {
    return icon ? { ...icon, color: 'currentColor' } : undefined;
  };

  return actionEnabled ? (
    props.tooltip ? (
      <TooltipWrapper message={props.tooltip}>
        <Button {...props} />
      </TooltipWrapper>
    ) : (
      <Button {...props} />
    )
  ) : (
    <TooltipWrapper message={actionText}>
      <Button
        className={props.className}
        title={props.title}
        role={props.role}
        iconLeft={iconRender(props.iconLeft)}
        iconRight={iconRender(props.iconRight)}
        disabled={true}
      />
    </TooltipWrapper>
  );
};
