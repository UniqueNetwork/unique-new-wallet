import { ReactNode } from 'react';
import { Loader } from '@unique-nft/ui-kit';

import './SuggestSpinner.scss';

type SuggestSpinnerProps = {
  loadingText: string | ReactNode;
};

export const SuggestSpinner = ({ loadingText }: SuggestSpinnerProps) => (
  <div className="suggest-spinner">
    <Loader label={loadingText} size="small" />
  </div>
);
