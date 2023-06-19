import { message } from 'antd';
import { useRequest } from 'ahooks';
////
import { getAllWaybillsForwarder } from '@/services/request/waybill';

const useDownloadINV = (opt: { params: any }) => {
  const downloadINVApi = useRequest(
    async () =>
      await getAllWaybillsForwarder({
        ...opt?.params,
        page: 0,
        perPage: 100000000,
      }),
    {
      manual: true,
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );
  const handleDownload = (onlyINV2?: boolean) => {
    let params = new URLSearchParams();
    const searchParams = opt.params;
    for (let key in searchParams) {
      if (key === 'page' || key === 'perPage') {
        continue;
      }
      if (!searchParams[key] && searchParams[key] !== 0) {
        continue;
      }
      if (Array.isArray(searchParams[key]) && !searchParams[key].length) {
        continue;
      }
      params.append(key, searchParams[key]);
    }
    const path = onlyINV2 ? '#/print/INV2?' : '#/print/INV?';
    window.open(
      window.location.origin +
        window.location.pathname +
        path +
        params.toString(),
    );
  };
  return {
    downloadINVApi,
    handleDownload,
  };
};

export default useDownloadINV;
