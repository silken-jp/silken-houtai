import dayjs from 'dayjs';

// find last process histories by type
export const findLastPH = (source: any[], type: number) => {
  for (let i = source.length; i > 0; i--) {
    const ele = source[i - 1];
    if (ele?.process_type === type) {
      return {
        name: ele?.user_name,
        time: dayjs(ele?.createdAt).format('YYYY.MM.DD HH:mm:ss'),
      };
    }
  }
};
