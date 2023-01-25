import React from 'react';
import styled from 'styled-components/macro';

interface ProgressBarProps {
  filledPercent: number;
  className?: string;
  height?: number;
  width?: number;
}

export function ProgressBar({
  filledPercent,
  className,
  height = 4,
  width = 308,
}: ProgressBarProps) {
  return (
    <Bar className={className} height={height} width={width}>
      <FilledBar filledPercent={filledPercent} height={height} />
    </Bar>
  );
}

const Bar = styled.div<{ height: number; width: number }>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  background-color: var(--color-primary-200);
  border-radius: 16px;
`;

const FilledBar = styled.div<{ filledPercent: number; height: number }>`
  height: ${({ height }) => height}px;
  width: ${(props) => props.filledPercent}%;
  background-color: var(--color-primary-500);
  border-radius: 16px;
`;
