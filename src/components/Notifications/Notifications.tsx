import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import './Notifications.scss';
import { Icon, IconProps } from '../Icon';
import { Typography } from '../Typography';

export type NotificationSeverity = 'warning' | 'error' | 'info';

export type NotificationPlacement = 'right' | 'left';

export interface AlertProps {
  key?: string;
  severity: NotificationSeverity;
  content: ReactNode;
  state?: 'closed' | 'open';
  icon?: IconProps;
}

export interface NotificationsContextValueType {
  push(props: AlertProps): void;
  close(index: number): void;
  clearAll(): void;
}

export interface NotificationsProps {
  children: ReactNode;
  placement?: NotificationPlacement;
  closable?: boolean;
  closingDelay?: number;
  maxAlerts?: number;
}

const noop = () => {};

export const NotificationsContext = createContext<NotificationsContextValueType>({
  push: noop,
  close: noop,
  clearAll: noop,
});

export const Notifications = ({
  children,
  placement = 'right',
  closable = true,
  closingDelay = 5000,
  maxAlerts = 5,
}: NotificationsProps) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);
  const alertKey = useRef(0);
  const timerId = useRef<NodeJS.Timer>();

  const clearingLoop = () => {
    timerId.current && clearInterval(timerId.current);
    timerId.current = setInterval(() => {
      setAlerts((alerts) => {
        if (!alerts.length) {
          return alerts;
        }
        return alerts
          .filter((alert) => alert.state !== 'closed')
          .map((alert, index) => ({
            ...alert,
            state: index === 0 ? 'closed' : alert.state,
          }));
      });
    }, closingDelay);
  };

  const push = useCallback(
    (props: AlertProps) => {
      setAlerts((alerts) => [
        ...alerts.filter((item) => item.state !== 'closed').slice(1 - maxAlerts),
        {
          key: `notification-alert-${(alertKey.current += 1)}`,
          ...props,
        },
      ]);
      clearingLoop();
    },
    [setAlerts, maxAlerts],
  );

  const close = useCallback(
    (index: number) =>
      setAlerts((alerts) =>
        alerts.map((item, itemIndex) => ({
          ...item,
          state: itemIndex === index ? 'closed' : item.state,
        })),
      ),
    [setAlerts],
  );

  const clearAll = useCallback(
    () =>
      setAlerts((alerts) =>
        alerts
          .filter((item) => item.state !== 'closed')
          .map((item) => ({ ...item, state: 'closed' })),
      ),
    [setAlerts],
  );

  const getDefaultIcon = (severity: NotificationSeverity): IconProps =>
    severity === 'info'
      ? { name: 'success', size: 32, color: '#fff' }
      : { name: 'warning', size: 32, color: '#fff' };

  useEffect(() => {
    return () => timerId.current && clearInterval(timerId.current);
  }, [closingDelay]);

  const value = useMemo(
    () => ({
      push,
      close,
      clearAll,
    }),
    [push, close, clearAll],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <div className={classNames('notification-container', placement)}>
        {alerts.map(({ content, state, severity, icon, key }, index) => (
          <div
            key={key}
            className={classNames('notification-alert', [severity, state])}
            onClick={() => closable && close(index)}
          >
            <Icon {...(icon || getDefaultIcon(severity))} />
            <Typography color="var(---color-additional-light)" size="m" weight="light">
              {content}
            </Typography>
          </div>
        ))}
      </div>
    </NotificationsContext.Provider>
  );
};
