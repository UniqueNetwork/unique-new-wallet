export const getScanAddresses = (
  network: string,
): { urlSubscan: string; urlUniquescan: string } => {
  return {
    urlSubscan: process.env[`REACT_APP_NET_${network}_SUBSCAN_ADDRESS`] || '',
    urlUniquescan: process.env[`REACT_APP_NET_${network}_UNIQUESCAN_ADDRESS`] || '',
  };
};
