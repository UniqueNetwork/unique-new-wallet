import { useEffect, useState } from 'react';

export const useFooter = () => {
  const [footer, setFooter] = useState('');

  useEffect(() => {
    (async () => {
      const footerResponse = await fetch('/footer.html');
      const footerHtml = await footerResponse.text();
      setFooter(footerHtml);
    })();
  }, []);

  return footer;
};
