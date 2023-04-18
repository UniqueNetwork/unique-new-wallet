import styled from 'styled-components';

import { Loader, Typography } from '../components';
import { Alert } from '../components/Alert';

type Props = {
  fee?: string;
  feeLoading?: boolean;
  className?: string;
};

export const FeeInformationTransaction = ({ fee, className, feeLoading }: Props) => {
  return (
    <StyledAlert className={className} type="warning">
      {feeLoading ? (
        <FeeLoader>
          <Loader size="small" label="Calculating fee" placement="left" />
        </FeeLoader>
      ) : (
        <Typography
          size="s"
          color="inherit"
          weight="regular"
        >{`A fee of ~${fee} can be applied to the transaction`}</Typography>
      )}
    </StyledAlert>
  );
};

const StyledAlert = styled(Alert)`
  line-height: 22px;
`;

const FeeLoader = styled.span`
  .unique-loader {
    .loader {
      width: calc(var(--prop-gap) * 1.375);
      height: calc(var(--prop-gap) * 1.375);
      border-top-color: var(--color-primary-500);
      border-left-color: var(--color-primary-500);
    }

    .loader-label {
      font-size: var(--prop-font-size);
      font-weight: calc(var(--prop-font-weight) + 100);
      color: var(--color-primary-500);
    }
  }
`;
