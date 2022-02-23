import { Button, message } from 'antd';
import { useHistory } from 'umi';

import { getUserInfo } from '@/services/useStorage';
import { moveWaybill } from '@/services/request/waybill';

export interface CleansingProps {
  LS: 'L' | 'S' | 'M';
  MAB?: string;
  waybill_status?: number;
}

const Cleansing: React.FC<CleansingProps> = (props) => {
  const { MAB = '', LS } = props;
  const history = useHistory();
  const { name: current_processor } = getUserInfo();

  const handleMoveWaybill = async () => {
    try {
      const res = await moveWaybill({
        move: 0,
        type: !MAB ? 0 : 1,
        MAB,
        LS,
        current_processor,
        waybill_status: props?.waybill_status || 1,
      });
      if (res?._id) {
        history.push('/cts/check/' + res._id);
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
