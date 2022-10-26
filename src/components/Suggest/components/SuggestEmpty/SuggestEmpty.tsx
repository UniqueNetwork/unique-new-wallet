import './SuggestEmpty.scss';

export interface SuggestEmptyProps {
  message: string;
}

export const SuggestEmpty = ({ message }: SuggestEmptyProps) => (
  <div className="suggest-empty-message">{message}</div>
);
