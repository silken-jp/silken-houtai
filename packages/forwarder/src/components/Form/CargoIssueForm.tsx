import { useEffect } from 'react';
import { Modal, Form, Input, Card, Row, Col } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
import { getAgentInfo } from '@/services/useStorage';

const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 12 },
};

const formRowItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

const formHalfItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const shadowStyle: React.CSSProperties = {
  WebkitBoxShadow: '0px 2px 12px 0px rgba(0,0,0,.1)',
  boxShadow: '0px 2px 12px 0px rgba(0,0,0,.1)',
  marginBottom: 20,
};

interface DataSource extends API.Driver {}

export interface CargoIssueFormProps
  extends useSKForm.SKFormProps<DataSource> {}

const CargoIssueForm: React.FC<CargoIssueFormProps> = (props) => {
  const agentInfo = getAgentInfo();
  console.log(agentInfo);
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        // name: props?.dataSource?.name || '',
        // tel: props?.dataSource?.tel || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={1200} style={{ marginTop: '15vh' }}>
      <Form name="CargoIssueForm" {...formItemLayout} {...formProps}>
        <Card title="S.C.LOGISTICS" style={shadowStyle}>
          <Row>
            <Col span={8}>
              <Form.Item label="MASTER番号" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="HOUSE番号" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="登録者" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="伝票番号" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="代理店" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="連絡日" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="問題該当" name="" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="返品状態" name="" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状態" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="問題詳細" name="" {...formRowItemLayout}>
                <Input.TextArea rows={7} disabled />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="Forwarder" style={shadowStyle}>
          <Row>
            <Col span={8}>
              <Form.Item label="科目" name="" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="回答日" name="" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="通知者">
                <Input disabled value={agentInfo?.account} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="内容" name="" {...formRowItemLayout}>
                <Input.TextArea rows={7} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="受取人" name="">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="受取人電話番号" name="">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="受取人郵便番号" name="">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="受取人住所" name="" {...formRowItemLayout}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="品名"
                name=""
                {...formRowItemLayout}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="S.C.LOGISTICS" style={shadowStyle}>
          <Row>
            <Col span={8}>
              <Form.Item label="発送日" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="新伝票番号" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8} />
            <Col span={8}>
              <Form.Item label="対応方法" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="処理日" name="">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="料金項目" name="" {...formRowItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金項目1" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金1" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金項目2" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金2" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金項目3" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金3" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金項目4" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金4" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金項目5" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="料金5" name="" {...formHalfItemLayout}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="備考" name="" {...formRowItemLayout}>
                <Input.TextArea rows={7} disabled />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default CargoIssueForm;
