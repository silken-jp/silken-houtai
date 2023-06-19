import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Waybill {}

export interface TodoMemoFormProps extends useSKForm.SKFormProps<DataSource> {}

const TodoMemoForm: React.FC<TodoMemoFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        todo_memo: props?.dataSource?.todo_memo || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="TodoMemoForm" {...formItemLayout} {...formProps}>
        <Form.Item label="Memo" name="todo_memo">
          <Input.TextArea placeholder="Memo" autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TodoMemoForm;
