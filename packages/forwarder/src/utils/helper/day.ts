import dayjs from 'dayjs';

export const dayFormat = (date: string, format?: any) => {
  return date && dayjs(date).format(format || 'YYYY.MM.DD HH:mm:ss');
};

export const dayLocal = (date: string) => {
  return date && dayjs(date);
};
