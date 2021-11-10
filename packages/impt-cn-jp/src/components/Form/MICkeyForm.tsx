import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Space, Select } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.MICkeys {}

export interface MICkeyFormProps extends useSKForm.SKFormProps<DataSource> {}

const MICkeyForm: React.FC<MICkeyFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        price: props?.dataSource?.price || ['', ''],
        words: props?.dataSource?.words || '',
        file_type: props?.dataSource?.file_type || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps}>
      <Form name="MICkeyForm" {...formItemLayout} {...formProps}>
        <Form.Item label="金額設定" rules={[{ required: true }]}>
          <Space>
            <Form.Item noStyle name={['price', 0]}>
              <InputNumber placeholder="min" min={1} />
            </Form.Item>
            <span>~</span>
            <Form.Item noStyle name={['price', 1]}>
              <InputNumber placeholder="max" min={1} />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="key-words" name="words" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="業務コード" name="file_type" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'IDA', label: 'IDA' },
              { value: 'MIC', label: 'MIC' },
            ]}
          />
        </Form.Item>
        <Form.Item label="LS" name="LS">
          <Select
            allowClear
            options={[
              { value: 'L', label: 'L' },
              { value: 'S', label: 'S' },
            ]}
          />
        </Form.Item>
        <Form.Item label="タブ" name="tab">
          <Select
            allowClear
            options={[
              { value: 'ALL', label: 'ALL' },
              { value: 'Hold', label: 'Hold' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MICkeyForm;
