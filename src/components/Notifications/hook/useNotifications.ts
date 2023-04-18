import { ReactNode, useContext, useMemo } from 'react';

import { NotificationsContext } from '../Notifications';
import { IconProps } from '../../Icon';

export const useNotifications = () => {
  const { push, clearAll } = useContext(NotificationsContext);

  return useMemo(
    () => ({
      info: (content: ReactNode, icon?: IconProps) =>
        push({ content, severity: 'info', icon }),
      warning: (content: ReactNode, icon?: IconProps) =>
        push({ content, severity: 'warning', icon }),
      error: (content: ReactNode, icon?: IconProps) =>
        push({ content, severity: 'error', icon }),
      clearAll,
    }),
    [push, clearAll],
  );
};
