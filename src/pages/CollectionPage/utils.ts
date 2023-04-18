export const getSponsorShip = (
  sponsorship: string | null,
): { isConfirmed: boolean; value: string } | null => {
  if (!sponsorship) {
    return null;
  }
  try {
    const sponsorshipValue = sponsorship;

    if (sponsorshipValue) {
      return {
        isConfirmed: true,
        value: sponsorshipValue,
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};
