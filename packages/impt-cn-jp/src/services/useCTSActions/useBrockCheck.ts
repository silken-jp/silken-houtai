import { message } from 'antd';
import { useHistory } from 'umi';
import { useRequest } from 'ahooks';

import { getUserInfo, getSearchParams } from '@/services/useStorage';
import { moveWaybill } from '@/services/request/waybill';

const useBrockCheck = (LS: string, dataSource: any[]) => {
  const history = useHistory();
  const { name: current_processor } = getUserInfo();
  const params = getSearchParams(LS);

  const brockCheckApi = useRequest(
    async () =>
      await moveWaybill({
        move: 0,
        check_type: '0',
        current_processor,
        ...params,
      }),
    {
      manual: true,
      onSuccess: (data) => {
        if (data) {
          history.push(`/cts/check/${data}?LS=${LS}&actionType=1&checkType=1`);
        } else {
          message.warning('この条件を満たすもの、見付かりません');
        }
      },
    },
  );
  const simpleBrockCheckApi = useRequest(
    async () =>
      await moveWaybill({
        move: 0,
        check_type: '0',
        current_processor,
        ...params,
      }),
    {
      manual: true,
      onSuccess: (data) => {
        if (data) {
          history.push(
            `/cts/check/${data}?LS=${LS}&actionType=1&checkType=1&isSimple=1`,
          );
        } else {
          message.warning('この条件を満たすもの、見付かりません');
        }
      },
    },
  );
  const handleBrockCheck = async () => {
    try {
      if (dataSource?.[0]) {
        history.push(
          `/cts/check/${dataSource[0]}?LS=${LS}&actionType=0&checkType=1`,
        );
      } else {
        throw 'error';
      }
    } catch (error: any) {
      message.warning(error);
    }
  };

  const handleBrockCheckSimple = async () => {
    try {
      if (dataSource?.[0]) {
        history.push(
          `/cts/check/${dataSource[0]}?LS=${LS}&actionType=0&checkType=1&isSimple=1`,
        );
      } else {
        throw 'error';
      }
    } catch (error: any) {
      message.warning(error);
    }
  };

  return {
    brockCheckApi,
    simpleBrockCheckApi,
    handleBrockCheck,
    handleBrockCheckSimple,
  };
};

export default useBrockCheck;
