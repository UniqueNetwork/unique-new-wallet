import classNames from 'classnames';
import { Avatar, IAvatarProps } from '@unique-nft/ui-kit';

import { SuggestOption } from '@app/pages/components/FormComponents';
import { getTokenIpfsUriByImagePath } from '@app/utils';

type Props = {
  img: string | undefined | null;
  title: string | undefined;
  isActive: boolean;
  typeAvatar: IAvatarProps['type'];
};

export const SuggestOptionNesting = ({ title, img, isActive, typeAvatar }: Props) => {
  return (
    <SuggestOption
      className={classNames('suggestion-item', {
        isActive,
      })}
    >
      <Avatar size={24} type={typeAvatar} src={getTokenIpfsUriByImagePath(img)} />
      <span className="suggestion-item__title">{title}</span>
    </SuggestOption>
  );
};
