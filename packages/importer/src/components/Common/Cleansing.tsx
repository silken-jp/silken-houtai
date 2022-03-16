import { Button, message } from 'antd';
import { useHistory } from 'umi';

import { getUserInfo, getSearchParams } from '@/services/useStorage';
import { moveWaybill } from '@/services/request/waybill';

export interface CleansingProps {
  LS: 'L' | 'S' | 'M';
}

const Cleansing: React.FC<CleansingProps> = (props) => {
  const { LS } = props;
  const history = useHistory();

  const handleMoveWaybill = async () => {
    try {
      const { name: current_processor } = getUserInfo();
      const params = getSearchParams(LS);
      const res = await moveWaybill({
        move: 0,
        current_processor,
        ...params,
      });
      if (res) {
        history.push('/cts/check/' + res);
      } else {
        throw 'この条件を満たすもの、見付かりません';
      }
    } catch (error: any) {
      message.warning(error);
    }
  };

  return (
    <Button type="primary" onClick={handleMoveWaybill}>
      クレンジング
    </Button>
  );
};

export default Cleansing;
