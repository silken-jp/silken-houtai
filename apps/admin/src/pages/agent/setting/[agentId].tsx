import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { useParams } from 'umi';
import {
  Card,
  message,
  Button,
  Form,
  InputNumber,
  Space,
  Table,
  Checkbox,
  Collapse,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
////
import UploadDelivery from '@/pages/agent/components/UploadDelivery';
import {
  getAgent,
  updateAgent,
  importDeliveryPrice,
} from '@/services/request/agent';
import { renderPrice } from '@/utils/helper/helper';

export interface AgentSettingsProps {}

const AgentSettings: React.FC<AgentSettingsProps> = () => {
  const [form] = Form.useForm();
  const { agentId } = useParams<any>();
  const [activeKey, setActiveKey] = useState<string | string[]>([]);
  const [activeKeyPriceTable, setActiveKeyPriceTable] = useState<
    string | string[]
  >([]);
  const agentAPI = useRequest(() => getAgent({ agentId }));

  // action
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateAgent({ agentId, ...values });
      agentAPI.refresh();
      message.success('保存成功');
    } catch (error) {
      console.log(error);
      message.error('保存失敗');
    }
  };

  const uploadProps = {
    payload: { agent: agentId },
    onUpload: agentAPI.refresh,
  };

  return (
    <PageContainer
      title={agentAPI?.data?.name}
      loading={agentAPI?.loading}
      header={{
        breadcrumb: {
          routes: [
            { path: '/agent/setting', breadcrumbName: 'フォワーダー管理' },
            { path: '', breadcrumbName: 'フォワーダー料金設定' },
          ],
        },
      }}
      extra={
        <Space>
          <span>テンプレート:</span>
          <Button
            href="https://s3.ap-northeast-1.amazonaws.com/assets.sclogi.jp/upload_template/delivery_sagawa.xlsx"
            download
          >
            佐川
          </Button>
          <Button
            href="https://s3.ap-northeast-1.amazonaws.com/assets.sclogi.jp/upload_template/delivery_yamato.xlsx"
            download
          >
            ヤマト
          </Button>
        </Space>
      }
    >
      <div style={{ overflow: 'auto', height: 'calc(100vh - 220px)' }}>
        <Form
          size="small"
          id="AgentSettingForm"
          form={form}
          initialValues={agentAPI?.data}
        >
          <Collapse activeKey={activeKey} onChange={setActiveKey}>
            <Collapse.Panel header="通関" key="1">
              <Card title="IDA通関料設定">
                <Form.List name="IDA_clearances">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space key={field.key} align="baseline" wrap>
                          <Form.Item
                            name={[field.name, 'count_start']}
                            rules={[{ required: true }]}
                            label="件数（MIN）"
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="件数（MIN）"
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'count_end']}
                            rules={[{ required: true }]}
                            label="件数（MAX）"
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="件数（MAX）"
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'hawb_price']}
                            rules={[{ required: true }]}
                            label="単価（HAWB）"
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="単価（HAWB）"
                            />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          追加
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>
              <Card title="MIC通関料設定">
                <Form.List name="MIC_clearances">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space key={field.key} align="baseline" wrap>
                          <Form.Item
                            name={[field.name, 'count_start']}
                            rules={[{ required: true }]}
                            label="件数（MIN）"
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="件数（MIN）"
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'count_end']}
                            rules={[{ required: true }]}
                            label="件数（MAX）"
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="件数（MAX）"
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'hawb_price']}
                            rules={[{ required: true }]}
                            label="単価（HAWB）"
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="単価（HAWB）"
                            />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          追加
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>
              <br />
              <Button type="primary" onClick={handleSubmit}>
                保存
              </Button>
            </Collapse.Panel>
            <Collapse.Panel header="保税" key="2">
              <Card title="一次上屋料金設定">
                <Form.Item label="徴収しません" name="no_firstBonded">
                  <Checkbox />
                </Form.Item>
              </Card>
              <Card title="二次上屋料金設定">
                <Form.List name="SecondBondeds">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space key={field.key} align="baseline" wrap>
                          <Form.Item
                            label="件数（MIN）"
                            name={[field.name, 'count_start']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="件数（MIN）"
                            />
                          </Form.Item>
                          <Form.Item
                            label="件数（MAX）"
                            name={[field.name, 'count_end']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="件数（MAX）"
                            />
                          </Form.Item>
                          <Form.Item
                            label="制限（KG）"
                            name={[field.name, 'limit_GW']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="制限（KG）"
                            />
                          </Form.Item>
                          <Form.Item
                            label="制限内単価（HAWB）"
                            name={[field.name, 'limit_price']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="制限内単価（HAWB）"
                            />
                          </Form.Item>
                          <Form.Item
                            label="制限外単価（kg）"
                            name={[field.name, 'out_limit_kgs_price']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="制限外単価（kg）"
                            />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          追加
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>
              <Card title="保管料設定">
                <Form.List name="storages">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space key={field.key} align="baseline" wrap>
                          <Form.Item
                            label="件数（MIN）"
                            name={[field.name, 'count_start']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="件数（MIN）"
                            />
                          </Form.Item>
                          <Form.Item
                            label="件数（MAX）"
                            name={[field.name, 'count_end']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="件数（MAX）"
                            />
                          </Form.Item>
                          <Form.Item
                            label="制限（days）"
                            name={[field.name, 'limit_days']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="制限（days）"
                            />
                          </Form.Item>
                          <Form.Item
                            label="制限内単価（HAWB）"
                            name={[field.name, 'limit_price']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="制限内単価（HAWB）"
                            />
                          </Form.Item>
                          <Form.Item
                            label="制限外単価（kg * day）"
                            name={[field.name, 'out_limit_days_kgs_price']}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              step={1}
                              min={0}
                              style={{ width: 120 }}
                              placeholder="制限外単価（kg * day）"
                            />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          追加
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>
              <Card title="税関検査費用設定">
                <Space>
                  <Form.Item
                    label="単価（円/HAWB）"
                    name={['inspection', 'hawb_price']}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      step={1}
                      min={0}
                      style={{ width: 120 }}
                      placeholder="単価（円/HAWB）"
                    />
                  </Form.Item>
                  <Form.Item
                    label="月額MAX"
                    name={['inspection', 'month_max']}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      step={1}
                      min={0}
                      style={{ width: 120 }}
                      placeholder="月額MAX（円）"
                    />
                  </Form.Item>
                </Space>
              </Card>
              <br />
              <Button type="primary" onClick={handleSubmit}>
                保存
              </Button>
            </Collapse.Panel>
            <Collapse.Panel header="配送" key="3">
              <Card title="住所変更費・再梱包費・換面単費設定">
                <Space>
                  <Form.Item
                    label="住所変更費（円/HAWB）"
                    name={'address_change_fee'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber step={1} min={0} style={{ width: 120 }} />
                  </Form.Item>
                  <Form.Item
                    label="再梱包費（円/HAWB）"
                    name={'repack_fee'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber step={1} min={0} style={{ width: 120 }} />
                  </Form.Item>
                  <Form.Item
                    label="換面単費（円/HAWB）"
                    name={'label_change_fee'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber step={1} min={0} style={{ width: 120 }} />
                  </Form.Item>
                </Space>
              </Card>
              <br />
              <Button type="primary" onClick={handleSubmit}>
                保存
              </Button>
              <br />
              <br />
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
                    dataSource={agentAPI?.data?.sagawa_to_c}
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
                    dataSource={agentAPI?.data?.sagawa_u_packet}
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
                    dataSource={agentAPI?.data?.yamato_to_c}
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
                    dataSource={agentAPI?.data?.yamato_nekoposu}
                    uploadProps={uploadProps}
                  />
                </Collapse.Panel>
              </Collapse>
            </Collapse.Panel>
          </Collapse>
        </Form>
      </div>
    </PageContainer>
  );
};

interface PriceTableGroup {
  title: string;
  priceTableKey: string;
  dataSource: any;
  uploadProps: {
    payload: any;
    onUpload: any;
  };
}
const PriceTableGroup: React.FC<PriceTableGroup> = (props) => {
  const sagawa_columns = [
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
  const yamato_columns = [
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
    { title: '北海道', dataIndex: 'state1', render: renderPrice() },
    { title: '北東北', dataIndex: 'state2', render: renderPrice() },
    { title: '南東北', dataIndex: 'state3', render: renderPrice() },
    { title: '関東', dataIndex: 'state4', render: renderPrice() },
    { title: '信越', dataIndex: 'state5', render: renderPrice() },
    { title: '北陸', dataIndex: 'state6', render: renderPrice() },
    { title: '中部', dataIndex: 'state7', render: renderPrice() },
    { title: '関西', dataIndex: 'state8', render: renderPrice() },
    { title: '中国', dataIndex: 'state9', render: renderPrice() },
    { title: '四国', dataIndex: 'state10', render: renderPrice() },
    { title: '九州', dataIndex: 'state11', render: renderPrice() },
    { title: '沖縄', dataIndex: 'state12', render: renderPrice() },
  ];
  const columns = {
    sagawa_to_c: sagawa_columns,
    sagawa_u_packet: sagawa_columns,
    yamato_to_c: yamato_columns,
    yamato_nekoposu: yamato_columns,
  }[props?.priceTableKey];

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

export default AgentSettings;
