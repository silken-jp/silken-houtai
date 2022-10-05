import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Waybill {}

export interface WaybillINVBLFormProps
  extends useSKForm.SKFormProps<DataSource> {}

const WaybillINVBLForm: React.FC<WaybillINVBLFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        CMN: props?.dataSource?.CMN || '',
        _NT1: props?.dataSource?._NT1 || '',
        HSRepeat: props?.dataSource?.HSRepeat || [],
      });
    }
  }, [props]);

  if (props.type === 'MIC') {
    return (
      <Modal {...modalProps} width={700}>
        <Form name="WaybillINVBLForm" {...formItemLayout} {...formProps}>
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
        </Form>
      </Modal>
    );
  } else
    return (
      <Modal {...modalProps} width={700}>
        <Form name="WaybillINVBLForm" {...formItemLayout} {...formProps}>
          {/* <Form.List name="HSRepeat">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'first']}
                      rules={[
                        { required: true, message: 'Missing first name' },
                      ]}
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'last']}
                      rules={[{ required: true, message: 'Missing last name' }]}
                    >
                      <Input placeholder="Last Name" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List> */}
        </Form>
      </Modal>
    );
};

export default WaybillINVBLForm;
