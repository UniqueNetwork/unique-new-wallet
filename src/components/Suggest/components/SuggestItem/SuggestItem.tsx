import classNames from 'classnames';
import './SuggestItem.scss';

export interface SuggestItemProps<T> {
  suggestion: T;
  suggestionValue: string;
  isActive?: boolean;
}

export const SuggestItem = <T,>({ suggestionValue, isActive }: SuggestItemProps<T>) => (
  <div
    className={classNames('suggestion-item', {
      isActive,
    })}
    role="option"
    data-testid={isActive ? 'active' : undefined}
  >
    {suggestionValue}
  </div>
);
