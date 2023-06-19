import { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Checkbox } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.User {}

export interface UserFormProps extends useSKForm.SKFormProps<DataSource> {}

const UserForm: React.FC<UserFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        name: props?.dataSource?.name || '',
        initialName: props?.dataSource?.initialName || '',
        email: props?.dataSource?.email || '',
        password: props?.dataSource?.password || '',
        is_cleanser: !!props?.dataSource?.is_cleanser,
        is_broker: !!props?.dataSource?.is_broker,
        is_creator: !!props?.dataSource?.is_creator,
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps}>
      <Form name="UserForm" {...formItemLayout} {...formProps}>
        <Form.Item label="名前" name="name" rules={[{ required: true }]}>
          <Input placeholder="名前" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="initialName"
          name="initialName"
          rules={[{ required: true }]}
        >
          <Input placeholder="initialName" autoComplete="off" />
        </Form.Item>
        <Form.Item label="メール" name="email" rules={[{ required: true }]}>
          <Input placeholder="メール" autoComplete="off" />
        </Form.Item>
        {props?.type === 'add' && (
          <Form.Item
            label="パースワード"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="パースワード" autoComplete="off" />
          </Form.Item>
        )}
        <Form.Item label="権限">
          <Row>
            <Col span={8}>
              <Form.Item name="is_cleanser" valuePropName="checked">
                <Checkbox>cleanser</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="is_broker" valuePropName="checked">
                <Checkbox>broker</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="is_creator" valuePropName="checked">
                <Checkbox>creator</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
