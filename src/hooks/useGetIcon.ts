import { useState, useEffect } from 'react';

export const useGetIcon = (path: string) => {
  const [icon, setIcon] = useState('');

  useEffect(() => {
    fetch(path)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setIcon(data);
      });
  }, [path]);

  return icon;
};
