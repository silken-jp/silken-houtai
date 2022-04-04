import { Button, message } from 'antd';
import { useHistory } from 'umi';

import { getUserInfo, getSearchParams } from '@/services/useStorage';
import { moveWaybill } from '@/services/request/waybill';

export interface BrockProps {
  LS: 'L' | 'S' | 'M';
}

const Brock: React.FC<BrockProps> = (props) => {
  const { LS } = props;
  const history = useHistory();

  const handleMoveWaybill = async () => {
    message.info('Please waiting.');
    // try {
    //   const { name: current_processor } = getUserInfo();
    //   const params = getSearchParams(LS);
    //   const res = await moveWaybill({
    //     move: 0,
    //     current_processor,
    //     ...params,
    //   });
    //   if (res) {
    //     history.push('/cts/check/' + res);
    //   } else {
    //     throw 'この条件を満たすもの、見付かりません';
    //   }
    // } catch (error: any) {
    //   message.warning(error);
    // }
  };

  return (
    <Button type="primary" onClick={handleMoveWaybill}>
      ブローカーチェック
    </Button>
  );
};

export interface BrockBYSourceProps {
  dataSource?: any[];
}

const BrockBYSource: React.FC<BrockBYSourceProps> = (props) => {
  const { dataSource } = props;
  const history = useHistory();

  const handleMoveWaybill = async () => {
    message.info('Please waiting.');
    // try {
    //   if (dataSource?.[0]) {
    //     history.push('/cts/check/' + dataSource[0]);
    //   } else {
    //     throw 'error';
    //   }
    // } catch (error: any) {
    //   message.warning(error);
    // }
  };

  return (
    <Button
      size="small"
      type="dashed"
      disabled={!dataSource?.length}
      onClick={handleMoveWaybill}
    >
      ブローカーチェック
    </Button>
  );
};

export { BrockBYSource };
export default Brock;
