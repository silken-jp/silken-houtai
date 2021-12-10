import { useParams } from 'umi';
import { Descriptions, Card, Timeline } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';

export interface WaybillProps {}

const Waybill: React.FC<WaybillProps> = () => {
  const { hawbNo } = useParams<any>();
  const [intlWaybill] = useIntlFormat('waybill');
  return (
    <PageContainer
      header={{
        title: `${intlWaybill('hawbNo')}：${hawbNo}`,
        breadcrumb: {
          routes: [
            {
              path: '/waybill/waybill/biz-packet',
              breadcrumbName: intlWaybill('header.cn-to-jp'),
            },
            { path: '/', breadcrumbName: intlWaybill('header.BtoB') },
            { path: '', breadcrumbName: intlWaybill('header.info') },
          ],
        },
      }}
      content={
        <Descriptions column={3} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="主单号">G4564567456456</Descriptions.Item>
          <Descriptions.Item label="分单号">{hawbNo}</Descriptions.Item>
          <Descriptions.Item label="派送单号">534543421421</Descriptions.Item>
          <Descriptions.Item label="货物名称">肥宅快乐水</Descriptions.Item>
          <Descriptions.Item label="重量">12kg</Descriptions.Item>
          <Descriptions.Item label="快递员">吴昊</Descriptions.Item>
        </Descriptions>
      }
    >
      <br />
      <Card title="寄件人信息">
        <Descriptions column={3} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="寄件人">张三</Descriptions.Item>
          <Descriptions.Item label="寄件联系方式">13636363636</Descriptions.Item>
          <Descriptions.Item label="寄件人地址">中国XXXXXXXXXXXX</Descriptions.Item>
        </Descriptions>
      </Card>
      <br />
      <Card title="收件人信息">
        <Descriptions column={3} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="收件人">李四</Descriptions.Item>
          <Descriptions.Item label="收件人联系方式">09000008888</Descriptions.Item>
          <Descriptions.Item label="收件人地址">日本XXXXXXXXXXXXX</Descriptions.Item>
        </Descriptions>
      </Card>
      <br />

      <Card title="货物追踪">
        <Timeline>
          <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
          <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
          <Timeline.Item color="red">
            <p>Solve initial network problems 1</p>
            <p>Solve initial network problems 2</p>
            <p>Solve initial network problems 3 2015-09-01</p>
          </Timeline.Item>
          <Timeline.Item>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </Timeline.Item>
          <Timeline.Item color="gray">
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </Timeline.Item>
          <Timeline.Item color="gray">
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </Timeline.Item>
        </Timeline>
      </Card>
    </PageContainer>
  );
};

export default Waybill;
