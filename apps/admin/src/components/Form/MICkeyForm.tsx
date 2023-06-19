import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Space, Select, Checkbox } from 'antd';
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
        waybill_type: props?.dataSource?.waybill_type || '1',
        LS: props?.dataSource?.LS || '',
        waybill_status: props?.dataSource?.waybill_status || '1',
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
            <span>円</span>
          </Space>
        </Form.Item>
        <Form.Item label="key-words" name="words" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="業務コード"
          name="waybill_type"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: '0', label: 'IDA' },
              { value: '1', label: 'MIC' },
            ]}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(a, b) => a.waybill_type !== b.waybill_type}
        >
          {({ getFieldValue }) => (
            <>
              {getFieldValue('waybill_type') === '0' && (
                <Form.Item label="LS" name="LS" rules={[{ required: true }]}>
                  <Select
                    options={[
                      { value: 'L', label: 'L' },
                      { value: 'S', label: 'S' },
                    ]}
                  />
                </Form.Item>
              )}
            </>
          )}
        </Form.Item>
        <Form.Item
          label="タブ"
          name="waybill_status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: '1', label: 'Normal' },
              { value: '0', label: 'Other' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MICkeyForm;
