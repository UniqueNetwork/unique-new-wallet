import { Loader } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import CheckCircle from 'static/icons/check-circle.svg';

import { Modal, ModalProps } from '@app/components/Modal';
import { ContentRow } from '@app/pages/components/ModalComponents';

export type Step = {
  name: string;
  pending: boolean;
};

type SettingsCollectionModalProps = Omit<
  ModalProps,
  'children' | 'footerButtons' | 'title'
> & {
  steps: Step[];
  title: string;
  onConfirm(): void;
};

export const SettingsCollectionModal = ({
  onConfirm,
  steps,
  title,
  ...modalProps
}: SettingsCollectionModalProps) => (
  <Modal title={title} {...modalProps}>
    <ContentRow>
      {steps.map((step, index) => {
        return (
          <TxRow key={index}>
            <div>
              {step.pending ? (
                <Loader size="small" />
              ) : (
                <img src={CheckCircle} alt="done" />
              )}
            </div>
            <div>{step.name}</div>
          </TxRow>
        );
      })}
    </ContentRow>
  </Modal>
);

const TxRow = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  margin: 10px 0;
  align-items: center;
`;
