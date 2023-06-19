import { Card, Button, Descriptions, Divider, Spin } from 'antd';
import { useRequest } from 'ahooks';
////
import { genMabs, getMonthStat } from '@/services/request/mabs';

export interface ExtraCountProps {
  agentId?: API.ID;
  title: string;
  startDate: string;
  endDate: string;
}

const ExtraCount: React.FC<ExtraCountProps> = (props) => {
  const countInfoAPI = useRequest(
    async () => {
      const mabs = await getMonthStat({
        agentId: props?.agentId,
        flightStartDate: props.startDate,
        flightEndDate: props?.endDate,
      });
      return mabs?.[0] || {};
    },
    {
      refreshDeps: [props.agentId],
    },
  );
  const genMabsAPI = useRequest(genMabs, {
    manual: true,
  });

  const handleUpdate = async () => {
    await genMabsAPI.runAsync({
      agentId: props?.agentId,
      flightStartDate: props.startDate,
      flightEndDate: props?.endDate,
    });
    countInfoAPI.refresh();
  };

  return (
    <Spin spinning={countInfoAPI.loading}>
      <Card size="small">
        <Descriptions
          size="small"
          title={props.title}
          column={2}
          extra={
            <Button
              loading={genMabsAPI.loading}
              type="primary"
              size="small"
              onClick={handleUpdate}
            >
              更新
            </Button>
          }
        >
          <Descriptions.Item label="件数">
            {countInfoAPI?.data?.waybillTotalCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="重量">
            {countInfoAPI?.data?.GWTotalCount?.toFixed(2) || 0}
          </Descriptions.Item>
          <Descriptions.Item label="個数">
            {countInfoAPI?.data?.NOTotalCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="MAWB">
            {countInfoAPI?.data?.mawbTotalCount || 0}
          </Descriptions.Item>
          {/* <Descriptions.Item label="未許可件数">0</Descriptions.Item> */}
        </Descriptions>
        <Divider style={{ margin: '12px 0' }} />
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="成田">
            {countInfoAPI?.data?.NRTTotalCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="関西">
            {countInfoAPI?.data?.KIXTotalCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="羽田">
            {countInfoAPI?.data?.HNDTotalCount || 0}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Spin>
  );
};

export default ExtraCount;
