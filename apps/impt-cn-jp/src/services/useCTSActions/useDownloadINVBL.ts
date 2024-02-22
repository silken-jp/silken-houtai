import { message } from 'antd';
import { useRequest } from 'ahooks';
////
import { getAllWaybillsAdvance } from '@/services/request/waybill';
import { renderMutiINV } from '../renderINV/renderMutiINV';
import { getSearchParams } from '../useStorage';

const useDownloadINVBL = (LS: string, totalCount: number) => {
  const downloadINVBLApi = useRequest(
    async () => {
      const res = await Promise.all(
        Array.from({ length: Math.ceil(totalCount / 300) }, async (_, page) => {
          const { waybills } = await getAllWaybillsAdvance({
            ...getSearchParams(LS),
            page,
            perPage: 300,
          });
          return waybills;
        }),
      );
      return { totalCount, waybills: res.flat() };
    },
    {
      manual: true,
      onSuccess: (data) => {
        renderMutiINV(data.waybills);
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );
  return downloadINVBLApi;
};

export default useDownloadINVBL;
