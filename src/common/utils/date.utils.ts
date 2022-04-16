import dayjs from 'dayjs';

export const getCeiledDifferenceInDays = (fromDate: Date, toDate: Date) => {
  return Math.ceil(dayjs(toDate).diff(fromDate, 'days', true));
};

export default {
  getCeiledDifferenceInDays,
};
