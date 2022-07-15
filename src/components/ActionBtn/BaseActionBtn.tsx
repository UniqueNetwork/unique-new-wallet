import { createRef } from 'react';
import { Button, ButtonProps, IconProps, Tooltip } from '@unique-nft/ui-kit';

const tooltipRef = createRef<HTMLDivElement>();

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
    <>
      {props.tooltip ? (
        <>
          <Tooltip targetRef={tooltipRef}>{props.tooltip}</Tooltip>
          <span ref={tooltipRef}>
            <Button {...props} />
          </span>
        </>
      ) : (
        <Button {...props} />
      )}
    </>
  ) : (
    <>
      <Tooltip targetRef={tooltipRef}>{actionText}</Tooltip>
      <span ref={tooltipRef}>
        <Button
          className={props.className}
          title={props.title}
          role={props.role}
          iconLeft={iconRender(props.iconLeft)}
          iconRight={iconRender(props.iconRight)}
          disabled={true}
        />
      </span>
    </>
  );
};
