import styled from 'styled-components';

interface TagProps {
  label: string;
  type?: 'default' | 'info' | 'warning' | 'danger';
  onClick?: () => void;
}

const Wrapper = styled.span`
  appearance: none;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: var(--prop-border-radius);
  border: 1px solid transparent;
  display: inline-block;
  max-width: 100%;
  margin: ${(p) => p.onClick && '0'};
  padding: 0 calc(var(--prop-gap) / 2);
  background: 0 none;
  font-family: var(--prop-font-family);
  font-size: var(--prop-font-size);
  font-weight: var(--prop-font-weight);
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 22px;
  cursor: ${(p) => p.onClick && 'pointer'};

  &.default {
    border-color: var(--color-blue-grey-100);
    background-color: var(--color-blue-grey-100);
    color: var(--color-secondary-300);
  }

  &.info {
    border-color: var(--color-primary-500);
    background-color: var(--color-primary-100);
    color: var(--color-primary-500);
  }
`;

export const Tag = ({ label, type = 'default', onClick }: TagProps) => {
  const element = onClick ? 'button' : 'span';

  return (
    <Wrapper
      as={element}
      className={type}
      title={label}
      role="listitem"
      onClick={onClick}
    >
      {label}
    </Wrapper>
  );
};
