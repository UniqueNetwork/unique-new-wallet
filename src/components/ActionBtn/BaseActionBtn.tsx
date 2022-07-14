import { Button, ButtonProps, Tooltip, Text, IconProps } from '@unique-nft/ui-kit';
import styled from 'styled-components';

const Wrapper = styled.span`
  & > .unique-button {
    pointer-events: none;
  }
`;

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
        <Tooltip
          content={
            <Wrapper>
              <Button {...props} />
            </Wrapper>
          }
        >
          {tooltip}
        </Tooltip>
      )}
    </>
  ) : (
    <Tooltip
      content={
        <Wrapper>
          <Button
            className={props.className}
            title={props.title}
            role={props.role}
            iconLeft={iconRender(props.iconLeft)}
            iconRight={iconRender(props.iconRight)}
            disabled={true}
          />
        </Wrapper>
      }
    >
      <Text color="#fff">{actionText}</Text>
    </Tooltip>
  );
};
