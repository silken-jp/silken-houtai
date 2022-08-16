import { message } from 'antd';
import { useLocation } from 'umi';
import { useRequest } from 'ahooks';
////
import { getAllWaybills } from '@/services/request/waybill';
import EDIPrint from '../delivery/edi-print/components/EDIPrint';

export interface SagawaEDIProps {}

const SagawaEDI: React.FC<SagawaEDIProps> = () => {
  // state
  const location = useLocation();
  const urlParams = Object.fromEntries(new URLSearchParams(location.search));

  // api
  const printApi = useRequest(
    async () =>
      await getAllWaybills({
        ...urlParams,
        page: 0,
        perPage: 100000,
      }),
    {
      onSuccess: (res) => {
        if (res?.waybills?.length > 0) {
          // window.print();
        } else {
          message.error('条件を満たすHABを見つかりません。');
        }
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );

  if (printApi?.loading) return <>loading</>;

  const dataSource: API.Waybill[] = printApi?.data?.waybills || [];
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        {dataSource?.map((item: API.Waybill) => {
          return <EDIPrint key={item._id} dataSource={item} />;
        })}
      </div>
    </div>
  );
};

export default SagawaEDI;
