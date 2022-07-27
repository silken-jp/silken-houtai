import { message } from 'antd';
import { useRequest } from 'ahooks';
////
import { getAllWaybillsAdvance } from '@/services/request/waybill';
import { getSearchParams } from '../useStorage';

const useDownloadINVBL = (LS: string, dataSource?: any) => {
  const downloadINVBLApi = useRequest(
    async () =>
      await getAllWaybillsAdvance({
        ...getSearchParams(LS),
        page: 0,
        perPage: 100000000,
      }),
    {
      manual: true,
      onSuccess: (result) => {
        // handleExportXlsx(result?.waybills);
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );
  const handleDownload = () => {
    let params = new URLSearchParams();
    const searchParams = getSearchParams(LS);
    for (let key in searchParams) {
      if (!searchParams[key] && searchParams[key] !== 0) {
        continue;
      }
      if (Array.isArray(searchParams[key]) && !searchParams[key].length) {
        continue;
      }
      params.append(key, searchParams[key]);
    }
    window.open(
      window.location.origin +
        window.location.pathname +
        '#/print/INVBL?' +
        params.toString(),
    );
  };
  return {
    downloadINVBLApi,
    handleDownload,
  };
};

export default useDownloadINVBL;
