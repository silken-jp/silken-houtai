import { message } from 'antd';
import { useRequest } from 'ahooks';
////
import { getAllWaybillsAdvance } from '@/services/request/waybill';
import { renderMutiINV } from '../renderINV/renderMutiINV';
import { getSearchParams } from '../useStorage';

const useDownloadINVBL = (LS: string) => {
  const downloadINVBLApi = useRequest(
    async () =>
      await getAllWaybillsAdvance({
        ...getSearchParams(LS),
        page: 0,
        perPage: 100000000,
      }),
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
