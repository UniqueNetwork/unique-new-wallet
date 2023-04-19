import { useNotifications } from '@app/components';

interface Message {
  name: string;
  text: string;
}

export const useMessage = () => {
  const { error, info } = useNotifications();

  const showError = ({ name, text }: Message) => {
    error(text, {
      name,
      size: 32,
      color: 'white',
    });
  };

  const showInfo = ({ name, text }: Message) => {
    info(text, {
      name,
      size: 32,
      color: 'white',
    });
  };

  return {
    showError,
    showInfo,
  };
};
