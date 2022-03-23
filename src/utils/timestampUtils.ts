// Calculate how much time passed (ex. 10seconds, 5 hours, 3 days, 25weeks)
const timeDifference = (when: number, sinceWhen: number | null = null) => {
  const first = sinceWhen || new Date().getTime() / 1000;
  const second = when;
  // https://stackoverflow.com/questions/16767301/calculate-difference-between-2-timestamps-using-javascript
  let difference = Math.abs(first - second) * 1000;

  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);

  difference -= daysDifference * 1000 * 60 * 60 * 24;

  const hoursDifference = Math.floor(difference / 1000 / 60 / 60);

  difference -= hoursDifference * 1000 * 60 * 60;

  const minutesDifference = Math.floor(difference / 1000 / 60);

  difference -= minutesDifference * 1000 * 60;

  const secondsDifference = Math.floor(difference / 1000);
  // just an example, later on oculd be extended to calculate time difference (trying to avoid any external libs for this matter)
  let amount = secondsDifference;
  let timeType = 'second';

  if (minutesDifference >= 1) {
    timeType = 'minute';
    amount = minutesDifference;
  }

  if (hoursDifference >= 1) {
    timeType = 'hour';
    amount = hoursDifference;
  }

  if (daysDifference >= 1) {
    timeType = 'day';
    amount = daysDifference;
  }

  if (daysDifference >= 7) {
    timeType = 'week';
    amount = Math.round(daysDifference / 7);
  }

  if (amount < 1 && timeType === 'second') return 'Less than a second';

  return `${amount} ${timeType}${amount >= 2 ? 's' : ''}`;
};

const timestampTableFormat = (timestamp: number) => new Date(timestamp).toLocaleString('en-GB', {
  hour12: false
}).replaceAll('/', '-');

export { timeDifference, timestampTableFormat };
