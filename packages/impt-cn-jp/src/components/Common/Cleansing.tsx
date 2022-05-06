import { Button, message } from 'antd';
import { useHistory } from 'umi';

import { getUserInfo, getSearchParams } from '@/services/useStorage';
import { moveWaybill } from '@/services/request/waybill';

export interface CleansingProps {
  LS: 'L' | 'S' | 'M';
  disabled: boolean;
}

const Cleansing: React.FC<CleansingProps> = (props) => {
  const { LS, disabled } = props;
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
        history.push(`/cts/check/${res}?LS=${LS}&actionType=1`);
      } else {
        throw 'この条件を満たすもの、見付かりません';
      }
    } catch (error: any) {
      message.warning(error);
    }
  };

  return (
    <Button type="primary" onClick={handleMoveWaybill} disabled={disabled}>
      マスクレンジング
    </Button>
  );
};

export interface CleansingBYSourceProps {
  LS: 'L' | 'S' | 'M';
  disabled?: boolean;
  dataSource?: any[];
}

const CleansingBYSource: React.FC<CleansingBYSourceProps> = (props) => {
  const { LS, dataSource, disabled } = props;
  const history = useHistory();

  const handleMoveWaybill = async () => {
    try {
      if (dataSource?.[0]) {
        history.push(`/cts/check/${dataSource[0]}?LS=${LS}`);
      } else {
        throw 'error';
      }
    } catch (error: any) {
      message.warning(error);
    }
  };

  return (
    <Button
      size="small"
      type="dashed"
      disabled={disabled || !dataSource?.length}
      onClick={handleMoveWaybill}
    >
      シングルクレンジング
    </Button>
  );
};

export { CleansingBYSource };
export default Cleansing;
