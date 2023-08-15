import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
import { AGENT_HAWB } from '@/utils/constant';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.HAWBGroup {}

export interface HAWBGroupFormProps extends useSKForm.SKFormProps<DataSource> {}

const HAWBGroupForm: React.FC<HAWBGroupFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        group_name: props?.dataSource?.group_name || null,
        start_hab: props?.dataSource?.start_hab || null,
        end_hab: props?.dataSource?.end_hab || null,
        count: props?.dataSource?.count || null,
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="HAWBGroupForm" {...formItemLayout} {...formProps}>
        <Form.Item
          label="配送会社"
          name="group_name"
          rules={[{ required: true }]}
        >
          <Select placeholder="配送会社" options={AGENT_HAWB.GROUP_NAME} />
        </Form.Item>
        <Form.Item
          label="開始HAWB"
          name="start_hab"
          rules={[
            { required: true },
            {
              pattern: new RegExp('^[0-9]+$'),
              message: 'HAWBは数字のみです。',
            },
          ]}
        >
          <Input placeholder="開始HAWB" autoComplete="off" />
        </Form.Item>
        <Form.Item label="件数" name="count" rules={[{ required: true }]}>
          <InputNumber placeholder="件数" autoComplete="off" min={1} step={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HAWBGroupForm;
