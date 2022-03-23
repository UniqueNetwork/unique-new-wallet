import React, { FC } from 'react';
import styled from 'styled-components';

const Loading: FC<{className?: string }> = ({ className }) => {
  return <LoadingWrapper className={className}>
    <svg
      preserveAspectRatio='xMidYMid'
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx='50'
        cy='50'
        fill='none'
        r='35'
        stroke='#0085cc'
        strokeDasharray='164.93361431346415 56.97787143782138'
        strokeWidth='10'
      >
        <animateTransform
          attributeName='transform'
          dur='1s'
          keyTimes='0;1'
          repeatCount='indefinite'
          type='rotate'
          values='0 50 50;360 50 50'
        />
      </circle>
    </svg>
  </LoadingWrapper>;
};

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 32px;
  }
`;

export default Loading;
