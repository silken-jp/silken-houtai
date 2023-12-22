import { message } from 'antd';
import { useRequest } from 'ahooks';

import { getAllWaybillsForwarder } from '../request/waybill';
import { renderMutiINV } from './renderMutiINV';

interface UseMutiINV {
  params: any;
}

export function useMutiINV(opt: UseMutiINV) {
  const downloadINVApi = useRequest(
    async () => {
      const res = await getAllWaybillsForwarder({
        ...opt?.params,
        page: 0,
        perPage: 100000000,
      });
      await renderMutiINV(res.waybills);
    },
    {
      manual: true,
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );

  return downloadINVApi;
}
