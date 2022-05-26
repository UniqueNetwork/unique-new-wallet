export const getSponsorShip = (
  sponsorship: string | null,
): { isConfirmed: boolean; value: string } | null => {
  if (!sponsorship) {
    return null;
  }
  const objectSponsorship = JSON.parse(sponsorship);
  for (const key in objectSponsorship) {
    if (['unconfirmed', 'confirmed'].includes(key)) {
      return {
        isConfirmed: key === 'confirmed',
        value: objectSponsorship[key],
      };
    }
  }
  return null;
};
