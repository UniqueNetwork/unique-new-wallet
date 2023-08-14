import { AttributeSchema } from '@app/api/graphQL/types';

import { CreateTokenDialog, NewToken } from '../types';
import { AttributesModal } from './AttributesModal';
import { ChangeCollectionModal } from './ChangeCollectionModel';
import { RemovingModal } from './RemovingModal';

interface CreateTokensDialogsProps {
  dialog?: CreateTokenDialog;
  tokens: NewToken[];
  tokenPrefix: string;
  attributesSchema: Record<number, AttributeSchema> | undefined;
  onChange(tokens: NewToken[]): void;
  onConfirm(): void;
  onClose(): void;
}

export const CreateTokensDialogs = ({
  dialog,
  tokens,
  tokenPrefix,
  attributesSchema,
  onChange,
  onConfirm,
  onClose,
}: CreateTokensDialogsProps) => {
  switch (dialog) {
    case CreateTokenDialog.changeCollection:
      return <ChangeCollectionModal onSubmit={onConfirm} onClose={onClose} />;
    case CreateTokenDialog.editAttributes:
      return (
        <AttributesModal
          tokens={tokens}
          tokenPrefix={tokenPrefix}
          attributesSchema={attributesSchema}
          onChange={onChange}
          onClose={onClose}
        />
      );
    case CreateTokenDialog.removeToken:
      return <RemovingModal tokens={tokens} onSubmit={onConfirm} onClose={onClose} />;
    default:
      return null;
  }
};
