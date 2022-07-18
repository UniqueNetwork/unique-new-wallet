export const getSubscanAddress = (
  network: string,
): { urlSubscan: string; urlUniquescan: string } => {
  switch (network) {
    case 'UNIQUE':
      return {
        urlSubscan: process.env.REACT_APP_NET_UNIQUE_SUBSCAN_ADDRESS || '',
        urlUniquescan: process.env.REACT_APP_NET_UNIQUE_UNIQUESCAN_ADDRESS || '',
      };
    case 'QUARTZ':
      return {
        urlSubscan: process.env.REACT_APP_NET_QUARTZ_SUBSCAN_ADDRESS || '',
        urlUniquescan: process.env.REACT_APP_NET_QUARTZ_UNIQUESCAN_ADDRESS || '',
      };
    case 'OPAL':
      return {
        urlSubscan: '',
        urlUniquescan: process.env.REACT_APP_NET_OPAL_UNIQUESCAN_ADDRESS || '',
      };
    default:
      return {
        urlSubscan: '',
        urlUniquescan: '',
      };
  }
};
