import styled from 'styled-components';
import classNames from 'classnames';

import { AccountsGroupButton } from '@app/components';

type Props = {
  className?: string;
};

const WelcomeComponent = ({ className }: Props) => {
  return (
    <div className={classNames('unique-card welcome', className)}>
      <h1 className="header-text">Welcome to Unique network</h1>
      <div className="description">
        <p className="text">
          You need to connect a substrate account to use all the features.
        </p>
        <p className="text">Please select one of the options:</p>
      </div>
      <AccountsGroupButton />
    </div>
  );
};

export const Welcome = styled(WelcomeComponent)`
  height: calc(100vh - 154px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: var(--prop-font-family);

  .header-text {
    font-family: var(--prop-font-family-heading);
    font-size: 36px;
    font-weight: 700;
    margin: 0;
  }

  .description {
    padding: 20px;
    text-align: center;

    .text {
      font-family: var(--prop-font-family);
      font-size: 16px;
      margin: 0;
      padding: 4px;
      color: var(--title-color);
    }
  }

  .unique-card {
    background: var(--color-additional-light);
    box-shadow: 0 4px 12px var(--prop-shadow);
    border-radius: 4px;
    padding: 32px;

    &.empty {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
`;
