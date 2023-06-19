import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Radio, Space, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

interface DataSource extends API.Waybill {}

export interface HAWBFormProps extends useSKForm.SKFormProps<DataSource> {}

const HAWBForm: React.FC<HAWBFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  const LS = Form?.useWatch('LS', formProps.form);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        LS: props?.dataSource?.LS || 'M',
        waybill_type: props?.dataSource?.waybill_type || 'MIC',
        HAB: props?.dataSource?.HAB || '',
        CMN: props?.dataSource?.CMN || '',
        _NT1: props?.dataSource?._NT1 || '',
        HSRepeat: props?.dataSource?.HSRepeat || [],
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={900}>
      <Form name="HAWBForm" {...formItemLayout} {...formProps}>
        <Form.Item label="L・S・M識別" name="LS" rules={[{ required: true }]}>
          <Radio.Group
            onChange={(e) => {
              if (e?.target?.value === 'M') {
                formProps.form.setFieldValue('waybill_type', 'MIC');
              } else {
                formProps.form.setFieldValue('waybill_type', 'IDA');
              }
            }}
            options={[
              { value: 'L', label: 'Large' },
              { value: 'S', label: 'Small' },
              { value: 'M', label: 'MIC' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="業務コード"
          name="waybill_type"
          rules={[{ required: true }]}
        >
          <Input placeholder="業務コード" autoComplete="off" disabled />
        </Form.Item>
        <Form.Item label="HAWB番号" name="HAB" rules={[{ required: true }]}>
          <Input placeholder="HAWB番号" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="品名"
          name="CMN"
          rules={[{ required: true }, { max: 40 }]}
        >
          <Input placeholder="品名" autoComplete="off" />
        </Form.Item>
        <Form.Item label="値段" name="_NT1" rules={[{ required: true }]}>
          <InputNumber placeholder="値段" autoComplete="off" step={0.01} />
        </Form.Item>
        {LS !== 'M' && (
          <Form.Item label="繰返部" required>
            <Form.List name="HSRepeat">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        name={[field.name, 'CMN']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="101.CMN:品名" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'QN1']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="104.QN1:数量" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'DPR']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="113.DPR:課税価格" />
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
                      繰返部追加
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default HAWBForm;
