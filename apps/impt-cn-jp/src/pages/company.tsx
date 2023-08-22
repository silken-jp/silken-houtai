import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Row,
  Col,
  Table,
  Collapse,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
////
import { importDeliveryPrice } from '@/services/request/company';
import { getCompany, updateCompany } from '@/services/request/company';
import UploadDelivery from '@/pages/components/UploadDelivery';
import { renderPrice } from '@/utils/helper/helper';

export interface companyProps {}

const inputs = [
  { label: '企業名', name: 'company_name' },
  { label: '企業名・英語', name: 'company_name_en' },
  { label: '本社住所', name: 'company_add' },
  { label: '本社住所・英語', name: 'company_add_en' },
  { label: '本社電話', name: 'company_tel' },
  { label: 'URL', name: 'url' },
  { label: '営業所名', name: 'office_name' },
  { label: '営業所名・英語', name: 'office_name_en' },
  { label: '営業所所在地', name: 'office_add' },
  { label: '営業所所在地・英語', name: 'office_add_en' },
  { label: '営業所郵便番号', name: 'office_zip' },
  { label: '営業所電話', name: 'office_tel' },
  { label: '営業所FAX', name: 'office_fax' },
  { label: '利用者コード', name: 'user_code' },
  { label: 'システム区分', name: 'system_category' },
  { label: '業種', name: 'industry_category' },
  { label: '通関業者コード', name: 'broker_code' },
  { label: '保税蔵置場コード', name: 'BW_code' },
  { label: '保税蔵置場住所', name: 'BW_add' },
  { label: '保税蔵置場住所・英語', name: 'BW_add_en' },
  { label: '保税蔵置場電話', name: 'BW_tel' },
];

const company: React.FC<companyProps> = () => {
  // state
  const [form] = Form.useForm();
  const [activeKeyPriceTable, setActiveKeyPriceTable] = useState<
    string | string[]
  >([]);
  // api
  const { data = {}, error, loading, refresh } = useRequest(getCompany);
  const uploadProps = {
    onUpload: refresh,
  };

  // action
  async function handleSubmit() {
    try {
      const fields = await form.validateFields();
      await updateCompany({ companyId: data?._id, ...fields });
      message.success('submit success');
    } catch (error) {
      message.error('submit error');
    }
  }

  if (error) return <>error</>;

  return (
    <PageContainer loading={loading}>
      <Card
        title="基本設定"
        extra={
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            保存
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          name="companyForm"
          initialValues={{ ...data }}
        >
          <Row
            gutter={18}
            style={{
              marginBottom: 12,
              height: 'calc(100vh - 250px)',
              overflow: 'auto',
            }}
          >
            {inputs.map(({ label, name }) => (
              <Col key={name} span={12}>
                <Form.Item label={label} name={name}>
                  <Input />
                </Form.Item>
              </Col>
            ))}
            <Col span={24}>
              <Collapse
                activeKey={activeKeyPriceTable}
                onChange={setActiveKeyPriceTable}
              >
                <Collapse.Panel
                  header="【佐川ToC】配送料設定"
                  key="sagawa_to_c"
                >
                  <PriceTableGroup
                    title="【佐川ToC】配送料設定"
                    priceTableKey="sagawa_to_c"
                    dataSource={data?.sagawa_to_c}
                    uploadProps={uploadProps}
                  />
                </Collapse.Panel>

                <Collapse.Panel
                  header="【佐川ゆうパケット】配送料設定"
                  key="sagawa_u_packet"
                >
                  <PriceTableGroup
                    title="【佐川ゆうパケット】配送料設定"
                    priceTableKey="sagawa_u_packet"
                    dataSource={data?.sagawa_u_packet}
                    uploadProps={uploadProps}
                  />
                </Collapse.Panel>

                <Collapse.Panel
                  header="【ヤマトToC】配送料設定"
                  key="yamato_to_c"
                >
                  <PriceTableGroup
                    title="【ヤマトToC】配送料設定"
                    priceTableKey="yamato_to_c"
                    dataSource={data?.yamato_to_c}
                    uploadProps={uploadProps}
                  />
                </Collapse.Panel>

                <Collapse.Panel
                  header="【ヤマトネコポス】配送料設定"
                  key="yamato_nekoposu"
                >
                  <PriceTableGroup
                    title="【ヤマトネコポス】配送料設定"
                    priceTableKey="yamato_nekoposu"
                    dataSource={data?.yamato_nekoposu}
                    uploadProps={uploadProps}
                  />
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
        </Form>
      </Card>
    </PageContainer>
  );
};

interface PriceTableGroup {
  title: string;
  priceTableKey: string;
  dataSource: any;
  uploadProps: {
    payload?: any;
    onUpload?: any;
  };
}
const PriceTableGroup: React.FC<PriceTableGroup> = (props) => {
  const columns = [
    {
      title: '重量(MIN)',
      dataIndex: 'GW_min',
      render: (text: number) => `${text} KG`,
    },
    {
      title: '重量(MAX)',
      dataIndex: 'GW_max',
      render: (text: number) => `${text} KG`,
    },
    { title: '南九州', dataIndex: 'state1', render: renderPrice() },
    { title: '北九州', dataIndex: 'state2', render: renderPrice() },
    { title: '四国', dataIndex: 'state3', render: renderPrice() },
    { title: '中国', dataIndex: 'state4', render: renderPrice() },
    { title: '関西', dataIndex: 'state5', render: renderPrice() },
    { title: '北陸', dataIndex: 'state6', render: renderPrice() },
    { title: '東海', dataIndex: 'state7', render: renderPrice() },
    { title: '信越', dataIndex: 'state8', render: renderPrice() },
    { title: '関東', dataIndex: 'state9', render: renderPrice() },
    { title: '南東北', dataIndex: 'state10', render: renderPrice() },
    { title: '北東北', dataIndex: 'state11', render: renderPrice() },
    { title: '北海道', dataIndex: 'state12', render: renderPrice() },
  ];
  return (
    <>
      <Card
        title={props?.title + '(税抜) - 発送'}
        extra={
          <UploadDelivery
            {...props.uploadProps}
            importAction={(d: any) =>
              importDeliveryPrice({
                ...d,
                deliveryKey: props?.priceTableKey + '.delivery_price_table',
              })
            }
          />
        }
      >
        <Table
          dataSource={props?.dataSource?.delivery_price_table}
          pagination={false}
          columns={columns}
        />
      </Card>
      <Card
        title={props?.title + '(税抜) - 返送'}
        extra={
          <UploadDelivery
            {...props.uploadProps}
            importAction={(d: any) =>
              importDeliveryPrice({
                ...d,
                deliveryKey: props?.priceTableKey + '.return_price_table',
              })
            }
          />
        }
      >
        <Table
          dataSource={props?.dataSource?.return_price_table}
          pagination={false}
          columns={columns}
        />
      </Card>
      <Card
        title={props?.title + '(税抜) - 再発送'}
        extra={
          <UploadDelivery
            {...props.uploadProps}
            importAction={(d: any) =>
              importDeliveryPrice({
                ...d,
                deliveryKey: props?.priceTableKey + '.resend_price_table',
              })
            }
          />
        }
      >
        <Table
          dataSource={props?.dataSource?.resend_price_table}
          pagination={false}
          columns={columns}
        />
      </Card>
    </>
  );
};

export default company;
