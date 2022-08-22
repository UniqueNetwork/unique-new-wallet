import { Alert } from '@app/components/Alert';

type Props = {
  fee?: string;
  className?: string;
};

export const FeeInformationTransaction = ({ fee, className }: Props) => {
  return fee ? (
    <Alert className={className} type="warning">
      A fee of ~{fee} can be applied to the transaction
    </Alert>
  ) : null;
};
