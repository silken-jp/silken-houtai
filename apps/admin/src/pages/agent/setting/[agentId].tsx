import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { useParams } from 'umi';
import {
  Card,
  message,
  Button,
  Form,
  InputNumber,
  Space,
  Table,
  Divider,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
////
import UploadDelivery from '@/pages/agent/components/UploadDelivery';
import {
  getAgent,
  updateAgent,
  importResendPriceArray,
  importReturnPriceArray,
  importDeliveryPriceArray,
} from '@/services/request/agent';
import { renderPrice } from '@/utils/helper/helper';

export interface AgentSettingsProps {}

const AgentSettings: React.FC<AgentSettingsProps> = () => {
  const [form] = Form.useForm();
  const { agentId } = useParams<any>();
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
      message.success('保存失敗');
    }
  };

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

  const gw_columns = [
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
    { title: '値段', dataIndex: 'price', render: renderPrice() },
  ];
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
        <Button type="primary" onClick={handleSubmit}>
          保存
        </Button>
      }
    >
      <Form
        size="small"
        id="AgentSettingForm"
        form={form}
        style={{ overflow: 'auto', height: 'calc(100vh - 220px)' }}
        initialValues={agentAPI?.data}
      >
        <Divider>通関</Divider>
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
                        placeholder="単価（HAWB）"
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
                        placeholder="単価（HAWB）"
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
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
        <Divider>保税</Divider>
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
                        placeholder="制限外単価（kg）"
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
                        placeholder="制限外単価（kg * day）"
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
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
        <Card title="税関検査費用設定">
          <Form.Item
            label="単価（円/HAWB）"
            name={['inspection', 'hawb_price']}
            rules={[{ required: true }]}
          >
            <InputNumber
              step={1}
              min={0}
              style={{ width: 150 }}
              placeholder="単価（円/HAWB）"
            />
          </Form.Item>
        </Card>
        <br />
        <Divider>配送</Divider>
        <Card
          title="佐川配送料設定(税抜) - 発送"
          extra={
            <UploadDelivery
              payload={{ agent: agentId }}
              onUpload={agentAPI.refresh}
              importAction={importDeliveryPriceArray}
            />
          }
        >
          <Table
            dataSource={agentAPI?.data?.delivery_price_table}
            pagination={false}
            columns={columns}
          />
        </Card>
        <br />
        <Card
          title="佐川配送料設定(税抜) - 返送"
          extra={
            <UploadDelivery
              is_re
              payload={{ agent: agentId }}
              onUpload={agentAPI.refresh}
              importAction={importReturnPriceArray}
            />
          }
        >
          <Table
            dataSource={agentAPI?.data?.return_price_table}
            pagination={false}
            columns={gw_columns}
          />
        </Card>
        <br />
        <Card
          title="佐川配送料設定(税抜) - 再発送"
          extra={
            <UploadDelivery
              is_re
              payload={{ agent: agentId }}
              onUpload={agentAPI.refresh}
              importAction={importResendPriceArray}
            />
          }
        >
          <Table
            dataSource={agentAPI?.data?.resend_price_table}
            pagination={false}
            columns={gw_columns}
          />
        </Card>
        <br />
        <Card title="住所変更費・再梱包費・換面単費設定">
          <Space>
            <Form.Item
              label="住所変更費（円/HAWB）"
              name={'address_change_fee'}
              rules={[{ required: true }]}
            >
              <InputNumber step={1} min={0} style={{ width: 150 }} />
            </Form.Item>
            <Form.Item
              label="再梱包費（円/HAWB）"
              name={'repack_fee'}
              rules={[{ required: true }]}
            >
              <InputNumber step={1} min={0} style={{ width: 150 }} />
            </Form.Item>
            <Form.Item
              label="換面単費（円/HAWB）"
              name={'label_change_fee'}
              rules={[{ required: true }]}
            >
              <InputNumber step={1} min={0} style={{ width: 150 }} />
            </Form.Item>
          </Space>
        </Card>
        <br />
      </Form>
    </PageContainer>
  );
};

export default AgentSettings;
