import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const dayFormat = (date?: string, format = 'YYYY.MM.DD HH:mm:ss') => {
  return date && dayjs(date).format(format);
};

export const dayFormatTZ = (date?: string, format = 'YYYY.MM.DD HH:mm:ss') => {
  return date && dayjs(date).utc().format(format);
};

export const dayLocal = (date: string) => {
  return date && dayjs(date);
};

export function renderDate(format = 'YYYY-MM-DD') {
  return (date?: Date | string | number) =>
    date ? dayjs(date).format(format) : '';
}

export function renderDateTZ(format = 'YYYY-MM-DD') {
  return (date?: Date | string | number) =>
    date ? dayjs(date).utc().format(format) : '';
}
