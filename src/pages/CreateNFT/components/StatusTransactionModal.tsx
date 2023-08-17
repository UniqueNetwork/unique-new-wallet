import { ReactNode } from 'react';
import styled from 'styled-components';

import { Modal, ModalProps } from '@app/components/Modal';
import { ProgressBar } from '@app/components';

import { Alert } from '../../../components/Alert';
import { Loader } from '../../../components/Loader';

type Props = Pick<ModalProps, 'isVisible'> & {
  uploadingProgress?: number;
  mintingProgress?: number;
  totalTokens: number;
  batchSize: number;
  stage: 'uploading' | 'minting';
  isVisible: boolean;
  title?: string;
  warning?: ReactNode;
};

export const StatusTransactionModal = ({
  title = 'Please wait',
  stage,
  uploadingProgress = 0,
  mintingProgress = 0,
  totalTokens,
  batchSize,
  isVisible,
  warning,
}: Props) => {
  return (
    <Modal isVisible={isVisible} isClosable={false} title={title}>
      <StageWrapper>
        <Loader
          label={`Uploading ${uploadingProgress + 1}/${totalTokens} file`}
          state={stage === 'uploading' ? 'process' : 'done'}
        />
        {stage === 'uploading' && (
          <ProgressBar filledPercent={(uploadingProgress / totalTokens) * 100} />
        )}
      </StageWrapper>
      <StageWrapper>
        <Loader
          label={`Minting ${mintingProgress + 1}-${mintingProgress + batchSize} tokens`}
          state={stage === 'uploading' ? 'idle' : 'process'}
        />
        {stage === 'minting' && (
          <ProgressBar filledPercent={(mintingProgress / totalTokens) * 100} />
        )}
      </StageWrapper>
      {!!warning && <AlertStyled type="warning">{warning}</AlertStyled>}
    </Modal>
  );
};

const StageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const AlertStyled = styled(Alert)`
  margin-top: calc(var(--prop-gap) * 1.5);
  margin-bottom: 8px !important;
`;
