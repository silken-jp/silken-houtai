import dayjs from 'dayjs';

export const dayFormat = (
  date: string | number | Date | null | undefined,
  format?: any,
) => {
  return date && dayjs(date).format(format || 'YYYY.MM.DD HH:mm:ss');
};
