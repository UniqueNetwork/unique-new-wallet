import styled from 'styled-components';

import { Button, Modal, Typography } from '@app/components';
import { ModalFooter } from '@app/pages/components/ModalComponents';

import { MAX_MINT_TOKENS } from '../CreateNFTv2';

type ExceededModalProps = {
  isVisible?: boolean;
  tokensCount: number;
  leftTokens: number | string;
  onClose(): void;
};

export const ExceededModal = ({
  isVisible = true,
  tokensCount,
  leftTokens,
  onClose,
}: ExceededModalProps) => {
  const toMax = MAX_MINT_TOKENS - tokensCount;
  const toLimit = leftTokens !== 'unlimited' ? leftTokens : MAX_MINT_TOKENS;
  const message =
    toMax < toLimit
      ? `It is only possible to add ${toMax} more files because it is only allowed to create ${MAX_MINT_TOKENS} tokens at a time.`
      : `It is only possible to add ${toLimit} more files because collection has minting limit of tokens.`;
  return (
    <Modal title="Too many files" isVisible={isVisible} onClose={onClose}>
      <ModalContent>
        <Typography>{message}</Typography>
        <Typography>Please select the correct number of files.</Typography>
      </ModalContent>
      <ModalFooter>
        <Button role="outlined" title="Close" onClick={onClose} />
      </ModalFooter>
    </Modal>
  );
};

export const ModalContent = styled.div`
  margin-bottom: var(--prop-gap);
  display: flex;
  flex-direction: column;
`;
