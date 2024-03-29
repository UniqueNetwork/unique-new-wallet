import styled from 'styled-components';

import smile from '@app/static/hmm.png';
import { Link, Typography, Modal } from '@app/components';

type Props = {
  isVisible?: boolean;
  onFinish?: () => void;
  missingExtension?: 'Polkadot' | 'Metamask';
};

const extensionSourceLinks = {
  Polkadot: 'https://polkadot.js.org/extension/',
  Metamask: 'https://metamask.io/download/',
};

export const ExtensionMissingModal = ({
  isVisible,
  onFinish,
  missingExtension,
}: Props) => {
  if (!missingExtension) {
    return null;
  }
  return (
    <Modal
      isVisible={!!isVisible}
      onClose={() => {
        onFinish?.();
      }}
    >
      <ModalContent>
        <SmileImg src={smile} alt="something wrong"></SmileImg>
        <Typography color="grey-500">
          {missingExtension} extension is not installed or disabled. Please{' '}
          <Link href={extensionSourceLinks[missingExtension]} target="_blank">
            install
          </Link>{' '}
          it or activate in your browser settings.
        </Typography>
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled.div`
  margin-top: -32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: calc(var(--prop-gap) * 1.5);
  padding: 0 calc(var(--prop-gap) * 1.5) calc(var(--prop-gap) * 2);
  .unique-text {
    text-align: center;
  }
  .unique-link.primary {
    font-size: 16px;
  }
`;

const SmileImg = styled.img`
  height: 80px;
  width: 80px;
`;
