import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { useParams } from 'umi';
import { Card, message, Button, Form, InputNumber, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
////
import { getAgent, updateAgent } from '@/services/request/agent';

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
        initialValues={agentAPI?.data}
      >
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
        <Card title="保管料設定">
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
      </Form>
    </PageContainer>
  );
};

export default AgentSettings;
