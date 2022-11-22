import { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Select } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 12 },
};

const formRowItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

interface DataSource extends API.Issue {}

export interface ClearanceIssuesFormProps
  extends useSKForm.SKFormProps<DataSource> {}

const ClearanceIssuesForm: React.FC<ClearanceIssuesFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        updated_user: props?.dataSource?.updated_user || '',
        issue_reason: props?.dataSource?.issue_reason || '',
        status: props?.dataSource?.status || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={1200} style={{ marginTop: '15vh' }}>
      <Form name="ClearanceIssuesForm" {...formItemLayout} {...formProps}>
        <Row>
          <Col span={8}>
            <Form.Item label="状態" name="status">
              <Select
                allowClear
                placeholder="状態"
                options={[
                  { label: '未処理', value: '未処理' },
                  { label: '問題作成', value: '問題作成' },
                  { label: '代理店対応中', value: '代理店対応中' },
                  { label: 'CS対応中', value: 'CS対応中' },
                  { label: '対応完了', value: '対応完了' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="問題詳細"
              name="issue_reason"
              {...formRowItemLayout}
            >
              <Input.TextArea rows={7} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ClearanceIssuesForm;
