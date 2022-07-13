import { Button, ButtonProps, Tooltip, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

const Wrapper = styled.span`
  & > .unique-button {
    pointer-events: none;
  }
`;

export const BaseActionBtn = ({
  actionEnabled,
  actionText,
  ...props
}: ButtonProps & { actionEnabled: boolean; actionText: string }) => {
  return actionEnabled ? (
    <Button {...props} />
  ) : (
    <Tooltip
      content={
        <Wrapper>
          <Button
            className={props.className}
            title={props.title}
            role={props.role}
            iconLeft={props.iconLeft}
            iconRight={props.iconRight}
            disabled={true}
          />
        </Wrapper>
      }
    >
      <Text color="#fff">{actionText}</Text>
    </Tooltip>
  );
};
