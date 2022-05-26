export const getSponsorShip = (
  sponsorship: string | null,
): { isConfirmed: boolean; value: string } | null => {
  if (!sponsorship) {
    return null;
  }
  try {
    const objectSponsorship = JSON.parse(sponsorship);
    const sponsorshipValue = objectSponsorship.confirmed ?? objectSponsorship.unconfirmed;

    if (sponsorshipValue) {
      return {
        // eslint-disable-next-line no-prototype-builtins
        isConfirmed: objectSponsorship.hasOwnProperty('confirmed'),
        value: sponsorshipValue,
      };
    }

    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
