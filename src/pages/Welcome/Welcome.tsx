import styled from 'styled-components';
import classNames from 'classnames';

import { AccountsGroupButton, PagePaper } from '@app/components';
import { withPageTitle } from '@app/HOCs/withPageTitle';

type Props = {
  className?: string;
};

const WelcomeComponent = ({ className }: Props) => {
  return (
    <PagePaper className={classNames('unique-card welcome', className)}>
      <h1 className="header-text">Welcome to Unique network</h1>
      <div className="description">
        <p className="text">
          You need to connect a substrate account to use all the features.
        </p>
        <p className="text">Please select one of the options:</p>
      </div>
      <AccountsGroupButton />
    </PagePaper>
  );
};

const WelcomeStyled = styled(WelcomeComponent)`
  height: calc(100vh - 154px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: var(--prop-font-family);

  .header-text {
    font-size: 36px;
    font-weight: 700;
    font-family: var(--prop-font-family-heading);
    line-height: 1.5;
    text-align: center;
    margin: 0;

    @media (max-width: 567px) {
      font-size: 28px;
    }
  }

  .description {
    padding: 24px 0 32px;
    text-align: center;

    .text {
      font-size: 16px;
      font-family: var(--prop-font-family);
      line-height: 1.5;
      margin: 0;
      color: var(--title-color);

      &:first-child {
        margin-bottom: 8px;
      }
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

  // TODO: [UI-109] resolve zIndex for all popping elements
  .unique-modal-wrapper {
    z-index: 49;
  }
`;

export const Welcome = withPageTitle({ header: undefined })(WelcomeStyled);
