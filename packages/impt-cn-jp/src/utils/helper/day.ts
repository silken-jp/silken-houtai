import dayjs from 'dayjs';

export const dayFormat = (date: string, format?: any) => {
  return dayjs(date).format(format || 'YYYY.MM.DD HH:mm:ss');
};
