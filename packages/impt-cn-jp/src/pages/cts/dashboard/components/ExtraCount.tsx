import { Card, Spin, Descriptions, Divider } from 'antd';
import { useRequest } from 'ahooks';
////
import { getDstByDate } from '@/services/request/waybill';

export interface ExtraCountProps {
  agentId?: API.ID;
  title: string;
  counts: any[];
  loading: boolean;
  startDate: Date;
  endDate: Date;
}

const ExtraCount: React.FC<ExtraCountProps> = (props) => {
  const countInfoAPI = useRequest(
    async () =>
      await getDstByDate({
        agentId: props?.agentId,
        startDate: props.startDate,
        endDate: props?.endDate,
      }),
    {
      ready: !props.loading,
    },
  );

  return (
    <Card size="small" loading={props?.loading}>
      <Descriptions size="small" title={props.title} column={2}>
        <Descriptions.Item label="件数">{props?.counts?.[0]}</Descriptions.Item>
        <Descriptions.Item label="重量">{props?.counts?.[1]}</Descriptions.Item>
        <Descriptions.Item label="個数">{props?.counts?.[2]}</Descriptions.Item>
        <Descriptions.Item label="MAWB">{props?.counts?.[3]}</Descriptions.Item>
        {/* <Descriptions.Item label="未許可件数">0</Descriptions.Item> */}
      </Descriptions>
      <Divider style={{ margin: '12px 0' }} />
      {countInfoAPI.loading ? (
        <Spin>
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="成田">0</Descriptions.Item>
            <Descriptions.Item label="関西">0</Descriptions.Item>
            <Descriptions.Item label="羽田">0</Descriptions.Item>
          </Descriptions>
        </Spin>
      ) : (
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="成田">
            {countInfoAPI?.data?.find((item: any) => item?._id === 'NRT')
              ?.count || 0}
          </Descriptions.Item>
          <Descriptions.Item label="関西">
            {countInfoAPI?.data?.find((item: any) => item?._id === 'KIX')
              ?.count || 0}
          </Descriptions.Item>
          <Descriptions.Item label="羽田">
            {countInfoAPI?.data?.find((item: any) => item?._id === 'HND')
              ?.count || 0}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};

export default ExtraCount;
