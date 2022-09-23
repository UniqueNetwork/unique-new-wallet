import { ReactNode } from 'react';
import styled from 'styled-components';

export interface ProcessingProps {
  children?: ReactNode;
}

const Wrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
`;

const Processing = ({ children }: ProcessingProps) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Processing;
